import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../expense.service';
import { MatCardModule } from '@angular/material/card';
import { ExpenseCategoryLimitService } from './expense-category-limit.service';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ExpenseCategory, ExpenseCategoryLimitDto } from '../../../../models/Api';
import { IncomeExpenseService } from '../../income-expense.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

interface ExpenseCategoryLimitWithCurrentSpending {
  id: number | null;
  expenseCategory: ExpenseCategory;
  expenseLimit: number | null;
  currentSpending: number;
  overSpent: boolean;
}

@Component({
  selector: 'glfm-expense-category-limit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [ExpenseCategoryLimitService],
  templateUrl: './expense-category-limit.component.html',
  styleUrls: ['./expense-category-limit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCategoryLimitComponent implements OnInit {
  expenseCategoryLimitsWithCurrentSpending$: Observable<ExpenseCategoryLimitWithCurrentSpending[]> = combineLatest([
    this.expenseCategoryLimitService.expenseCategoryLimits$,
    this.expenseService.expenses$,
  ]).pipe(
    map(([expenseCategoryLimits, expenses]) => {
      return expenseCategoryLimits.map((expenseCategoryLimit) => {
        const currentSpending = expenses
          .filter((expense) => expense.expenseCategory.id === expenseCategoryLimit.expenseCategory.id)
          .reduce((acc, expense) => acc + expense.amount, 0);
        const overSpent = currentSpending > expenseCategoryLimit.expenseLimit!;
        return {
          ...expenseCategoryLimit,
          currentSpending,
          overSpent,
        };
      });
    })
  );

  availableExpenseCategories$ = combineLatest([
    this.expenseService.expenseCategories$,
    this.expenseCategoryLimitService.expenseCategoryLimits$,
  ]).pipe(
    map(([expenseCategories, expenseCategoryLimits]) => {
      return expenseCategories.filter(
        (expenseCategory) =>
          !expenseCategoryLimits.some(
            (expenseCategoryLimit) => expenseCategoryLimit.expenseCategory.id === expenseCategory.id
          )
      );
    })
  );

  VALIDATION_VALUES = {
    expenseLimit: {
      MIN: 0,
      MAX: 1_000_000_000,
    },
  };

  expenseCategoryLimitForm = this.formBuilder.group({
    id: this.formBuilder.control(null as number | null),
    expenseCategory: this.formBuilder.control(null as ExpenseCategory | null, Validators.required),
    expenseLimit: this.formBuilder.control(null as number | null, [
      Validators.min(this.VALIDATION_VALUES.expenseLimit.MIN),
      Validators.max(this.VALIDATION_VALUES.expenseLimit.MAX),
    ]),
  });

  #formValueExpenseCategoryLimit$ = new BehaviorSubject<ExpenseCategoryLimitDto | null>(null);
  formVisible$ = this.#formValueExpenseCategoryLimit$.pipe(
    tap((formValueExpenseCategoryLimit) => {
      this.expenseCategoryLimitForm.reset();
      if (formValueExpenseCategoryLimit?.id) {
        this.expenseCategoryLimitForm.setValue(formValueExpenseCategoryLimit);
      }
      this.incomeExpenseService.underEdit$.next(formValueExpenseCategoryLimit !== null);
    }),
    map((formValueExpenseCategoryLimit) => formValueExpenseCategoryLimit !== null)
  );

  constructor(
    public expenseCategoryLimitService: ExpenseCategoryLimitService,
    public incomeExpenseService: IncomeExpenseService,
    private expenseService: ExpenseService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.expenseCategoryLimitForm.controls.expenseLimit.addValidators(this.requiredIfNew());
  }

  requiredIfNew(): ValidatorFn {
    return (control) => {
      return this.expenseCategoryLimitForm.controls.id.value === null
        ? Validators.required(control)
        : Validators.nullValidator(control);
    };
  }

  addNew() {
    this.#formValueExpenseCategoryLimit$.next({
      id: null,
      expenseCategory: {},
      expenseLimit: 0,
    });
  }

  modifyExpenseCategoryLimit(expenseCategoryLimitWithCurrentSpending: ExpenseCategoryLimitWithCurrentSpending) {
    const expenseCategoryLimit = {
      id: expenseCategoryLimitWithCurrentSpending.id,
      expenseCategory: expenseCategoryLimitWithCurrentSpending.expenseCategory,
      expenseLimit: expenseCategoryLimitWithCurrentSpending.expenseLimit,
    };
    this.#formValueExpenseCategoryLimit$.next(expenseCategoryLimit);
  }

  cancelForm() {
    this.#formValueExpenseCategoryLimit$.next(null);
  }

  createOrModifyExpenseCategoryLimit() {
    if (this.expenseCategoryLimitForm.invalid) return;

    const expenseCategoryLimit = this.expenseCategoryLimitForm.getRawValue();
    const saveObject = { ...expenseCategoryLimit, expenseCategory: expenseCategoryLimit.expenseCategory ?? {} };
    if (expenseCategoryLimit.id === null) {
      this.expenseCategoryLimitService.createExpenseCategoryLimit(saveObject).subscribe((savedExpenseCategoryLimit) => {
        this.expenseCategoryLimitService.addExpenseCategoryLimit(savedExpenseCategoryLimit);
        this.cancelForm();
      });
    } else {
      if (expenseCategoryLimit.expenseLimit && expenseCategoryLimit.expenseLimit > 1) {
        this.expenseCategoryLimitService
          .modifyExpenseCategoryLimit(saveObject)
          .subscribe((savedExpenseCategoryLimit) => {
            this.expenseCategoryLimitService.updateExpenseCategoryLimit(savedExpenseCategoryLimit);
            this.cancelForm();
          });
      } else {
        this.expenseCategoryLimitService.deleteExpenseCategoryLimit(expenseCategoryLimit.id).subscribe(() => {
          this.expenseCategoryLimitService.removeExpenseCategoryLimit(expenseCategoryLimit.id!);
          this.cancelForm();
        });
      }
    }
  }
}
