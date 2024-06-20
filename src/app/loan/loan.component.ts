import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from './loan.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, map, tap } from 'rxjs';
import { LoanDto } from '../../models/Api';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialog/delete-dialog.component';
import { PeriodService } from '../period/period.service';

@Component({
  selector: 'glfm-loan',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    LoanDetailsComponent,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    DeleteDialogComponent,
  ],
  providers: [LoanService],
  host: { class: 'glfm-loan' },
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanComponent implements OnInit {
  VALIDATION_VALUES = {
    amount: {
      MIN: 1,
      MAX: 1_000_000_000,
    },
    name: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 30,
    },
    interestRate: {
      MIN: 1,
      MAX: 1000,
    },
    monthlyRepayment: {
      MIN: 1,
      MAX: 1_000_000_000,
    },
  };

  loanForm = this.formBuilder.group({
    id: this.formBuilder.control(null as number | null),
    amount: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.amount.MIN),
      Validators.max(this.VALIDATION_VALUES.amount.MAX),
    ]),
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(this.VALIDATION_VALUES.name.MIN_LENGTH),
      Validators.maxLength(this.VALIDATION_VALUES.name.MAX_LENGTH),
    ]),
    interestRate: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.interestRate.MIN),
      Validators.max(this.VALIDATION_VALUES.interestRate.MAX),
    ]),
    monthlyRepayment: this.formBuilder.control(null as number | null),
  });

  #formValueLoan$ = new BehaviorSubject<LoanDto | null>(null);
  formVisible$ = this.#formValueLoan$.pipe(
    tap((formValueLoan) => {
      this.loanForm.reset();
      if (formValueLoan?.id) {
        this.loanForm.setValue(formValueLoan);
        this.loanForm.controls.amount.setValidators([
          Validators.required,
          Validators.min(this.VALIDATION_VALUES.amount.MIN),
          Validators.max(Math.max(formValueLoan.amount, this.VALIDATION_VALUES.amount.MAX)),
        ]);
      }
      this.loanService.underEdit$.next(formValueLoan !== null);
    }),
    map((formValueLoan) => formValueLoan !== null)
  );

  constructor(
    public loanService: LoanService,
    public periodService: PeriodService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loanForm.controls.monthlyRepayment.setValidators([
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.monthlyRepayment.MIN),
      this.monthlyRepaymentMaxValidator(this.loanForm.controls.amount),
    ]);
  }

  addNew() {
    this.#formValueLoan$.next({
      id: null,
      amount: 0,
      name: '',
      interestRate: 0,
      monthlyRepayment: 0,
    });
  }

  modifyLoan(loan: LoanDto) {
    this.#formValueLoan$.next(loan);
  }

  deleteLoan(loanId: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loanId).subscribe(() => {
          this.loanService.removeLoan(loanId);
          this.#formValueLoan$.next(null);
        });
      }
    });
  }

  cancelForm() {
    this.#formValueLoan$.next(null);
  }

  createOrModifyLoan() {
    if (!this.loanForm.valid) {
      return;
    }

    const formValue = this.loanForm.getRawValue();
    const saveObject = {
      id: formValue.id,
      amount: formValue.amount!,
      name: formValue.name,
      interestRate: formValue.interestRate!,
      monthlyRepayment: formValue.monthlyRepayment!,
    };

    if (saveObject.id === null) {
      this.loanService.createLoan(saveObject).subscribe((savedLoan) => {
        this.loanService.addLoan(savedLoan);
        this.#formValueLoan$.next(null);
      });
    } else {
      this.loanService.modifyLoan(saveObject).subscribe((savedLoan) => {
        this.loanService.updateLoan(savedLoan);
        this.#formValueLoan$.next(null);
      });
    }
  }

  monthlyRepaymentMaxValidator(amountControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const amountControlValue = amountControl.value;
      const monthlyRepaymentControlValue = control.value;
      if (amountControlValue !== null && monthlyRepaymentControlValue !== null) {
        return monthlyRepaymentControlValue > amountControlValue ? { monthlyRepaymentMax: true } : null;
      }
      return null;
    };
  }
}
