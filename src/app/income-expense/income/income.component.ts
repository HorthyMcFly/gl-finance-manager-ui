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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog.component';
import { BalanceService } from '../../balance/balance.service';

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
    MatDialogModule,
    DeleteDialogComponent,
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
    editable: this.formBuilder.nonNullable.control(true),
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
    private balanceService: BalanceService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  addNew() {
    this.#formValueIncome$.next({
      id: null,
      amount: 0,
      source: '',
      comment: null,
      editable: true,
    });
  }

  modifyIncome(income: IncomeDto) {
    this.#formValueIncome$.next(income);
  }

  deleteIncome(incomeId: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.incomeService.deleteIncome(incomeId).subscribe(() => {
          this.incomeService.removeIncome(incomeId);
          this.resetFormAndReloadBalance();
        });
      }
    });
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
      editable: true,
    };

    if (saveObject.id === null) {
      this.incomeService.createIncome(saveObject).subscribe((savedIncome) => {
        this.incomeService.addIncome(savedIncome);
        this.resetFormAndReloadBalance();
      });
    } else {
      this.incomeService.modifyIncome(saveObject).subscribe((savedIncome) => {
        this.incomeService.updateIncome(savedIncome);
        this.resetFormAndReloadBalance();
      });
    }
  }

  private resetFormAndReloadBalance() {
    this.#formValueIncome$.next(null);
    this.balanceService.reloadBalance();
  }
}
