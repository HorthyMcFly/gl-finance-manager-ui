import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from './expense.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IncomeExpenseService } from '../income-expense.service';
import { BalanceService } from '../../balance/balance.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, first, map, tap } from 'rxjs';
import { ExpenseCategory, ExpenseDto } from '../../../models/Api';
import { DeleteDialogComponent } from '../../dialog/delete-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { ExpenseCategoryLimitComponent } from './expense-category-limit/expense-category-limit.component';

@Component({
  selector: 'glfm-expense',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    DeleteDialogComponent,
    MatSelectModule,
    ExpenseCategoryLimitComponent,
  ],
  providers: [ExpenseService],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseComponent implements OnInit {
  columns: string[] = ['amount', 'recipient', 'category', 'comment', 'relatedLoanName', 'edit'];

  VALIDATION_VALUES = {
    amount: {
      MIN: 1,
      MAX: 1_000_000_000,
    },
    recipient: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 30,
    },
    comment: {
      MAX_LENGTH: 100,
    },
  };

  expenseForm = this.formBuilder.group({
    id: this.formBuilder.control(null as number | null),
    amount: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.amount.MIN),
      Validators.max(this.VALIDATION_VALUES.amount.MAX),
    ]),
    recipient: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(this.VALIDATION_VALUES.recipient.MIN_LENGTH),
      Validators.maxLength(this.VALIDATION_VALUES.recipient.MAX_LENGTH),
    ]),
    expenseCategory: this.formBuilder.control(null as ExpenseCategory | null, [Validators.required]),
    comment: this.formBuilder.control(null as string | null, [
      Validators.maxLength(this.VALIDATION_VALUES.comment.MAX_LENGTH),
    ]),
    relatedLoanName: this.formBuilder.control(null as null | string),
    editable: this.formBuilder.nonNullable.control(true),
  });

  #formValueExpense$ = new BehaviorSubject<ExpenseDto | null>(null);
  formVisible$ = this.#formValueExpense$.pipe(
    tap((formValueExpense) => {
      this.expenseForm.reset();
      if (formValueExpense?.id) {
        this.expenseForm.setValue(formValueExpense);
      }
      this.incomeExpenseService.underEdit$.next(formValueExpense !== null);
    }),
    map((formValueExpense) => formValueExpense !== null)
  );

  expenseCategories: ExpenseCategory[] = [];

  constructor(
    public expenseService: ExpenseService,
    public incomeExpenseService: IncomeExpenseService,
    private balanceService: BalanceService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.expenseService.expenseCategories$
      .pipe(first())
      .subscribe((expenseCategories) => (this.expenseCategories = expenseCategories));
  }

  addNew() {
    this.#formValueExpense$.next({
      id: null,
      amount: 0,
      recipient: '',
      expenseCategory: this.expenseCategories[0],
      comment: null,
      relatedLoanName: null,
      editable: true,
    });
  }

  modifyExpense(expense: ExpenseDto) {
    this.#formValueExpense$.next(expense);
  }

  deleteExpense(expenseId: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.expenseService.deleteExpense(expenseId).subscribe(() => {
          this.expenseService.removeExpense(expenseId);
          this.resetFormAndReloadBalance();
        });
      }
    });
  }

  cancelForm() {
    this.#formValueExpense$.next(null);
  }

  createOrModifyExpense() {
    if (!this.expenseForm.valid) {
      return;
    }

    const formValue = this.expenseForm.getRawValue();
    const saveObject = {
      id: formValue.id,
      amount: formValue.amount!,
      recipient: formValue.recipient!,
      expenseCategory: formValue.expenseCategory!,
      comment: formValue.comment,
      relatedLoanName: formValue.relatedLoanName,
      editable: formValue.editable,
    };

    if (saveObject.id === null) {
      this.expenseService.createExpense(saveObject).subscribe((savedExpense) => {
        this.expenseService.addExpense(savedExpense);
        this.resetFormAndReloadBalance();
      });
    } else {
      this.expenseService.modifyExpense(saveObject).subscribe((savedExpense) => {
        this.expenseService.updateExpense(savedExpense);
        this.resetFormAndReloadBalance();
      });
    }
  }

  private resetFormAndReloadBalance() {
    this.#formValueExpense$.next(null);
    this.balanceService.reloadBalance();
  }

  compareExpenseCategories(category1: ExpenseCategory, category2: ExpenseCategory) {
    return category1.category === category2.category;
  }
}
