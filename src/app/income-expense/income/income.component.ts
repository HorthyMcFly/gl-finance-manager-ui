import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeService } from './income.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IncomeDto } from '../../../models/Api';
import { IncomeExpenseService } from '../income-expense.service';

@Component({
  selector: 'glfm-income',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [IncomeService],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent {
  columns: string[] = ['amount', 'source', 'comment', 'edit'];

  VALIDATION_VALUES = {
    amount: {
      MIN: 1,
      MAX: 1_000_000_000,
    },
    source: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 30,
    },
    comment: {
      MAX_LENGTH: 100,
    },
  };

  incomeForm = this.formBuilder.group({
    id: this.formBuilder.control(null as number | null),
    amount: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.amount.MIN),
      Validators.max(this.VALIDATION_VALUES.amount.MAX),
    ]),
    source: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(this.VALIDATION_VALUES.source.MIN_LENGTH),
      Validators.maxLength(this.VALIDATION_VALUES.source.MAX_LENGTH),
    ]),
    comment: this.formBuilder.control(null as string | null, [
      Validators.maxLength(this.VALIDATION_VALUES.comment.MAX_LENGTH),
    ]),
  });

  #formValueIncome$ = new BehaviorSubject<IncomeDto | null>(null);
  formVisible$ = this.#formValueIncome$.pipe(
    tap((formValueIncome) => {
      this.incomeForm.reset();
      if (formValueIncome?.id) {
        this.incomeForm.setValue(formValueIncome);
      }
      this.incomeExpenseService.underEdit$.next(formValueIncome !== null);
    }),
    map((formValueIncome) => formValueIncome !== null)
  );

  constructor(
    public incomeService: IncomeService,
    public incomeExpenseService: IncomeExpenseService,
    private formBuilder: FormBuilder
  ) {}

  addNew() {
    this.#formValueIncome$.next({
      id: null,
      amount: 0,
      source: '',
      comment: null,
    });
  }

  modifyIncome(income: IncomeDto) {
    this.#formValueIncome$.next(income);
  }

  cancelForm() {
    this.#formValueIncome$.next(null);
  }

  createOrModifyIncome() {
    if (!this.incomeForm.valid) {
      return;
    }

    const formValue = this.incomeForm.getRawValue();
    const saveObject = {
      id: formValue.id,
      amount: formValue.amount!,
      source: formValue.source!,
      comment: formValue.comment,
    };

    if (saveObject.id === null) {
      this.incomeService.createIncome(saveObject).subscribe((savedIncome) => {
        this.incomeService.addIncome(savedIncome);
        this.#formValueIncome$.next(null);
      });
    } else {
      this.incomeService.modifyIncome(saveObject).subscribe((savedIncome) => {
        this.incomeService.updateIncome(savedIncome);
        this.#formValueIncome$.next(null);
      });
    }
  }
}
