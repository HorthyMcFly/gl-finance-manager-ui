import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Subject, startWith, takeUntil } from 'rxjs';

interface CalculationResult {
  balanceByYear: number[];
  result: number;
}

@Component({
  selector: 'glfm-investment-simulation',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './investment-simulation.component.html',
  styleUrls: ['./investment-simulation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentSimulationComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  VALIDATION_VALUES = {
    startingAmount: {
      MIN: 0,
      MAX: 1_000_000_000,
    },
    interestRate: {
      MIN: 0,
      MAX: 1000,
    },
    monthlySavings: {
      MIN: 0,
      MAX: 1_000_000_000,
    },
    numberOfMonths: {
      MIN: 0,
      MAX: 1200,
    },
  };

  CALCULATION_TYPES = [
    {
      type: 'MONTHLY_SAVINGS',
      displayName: 'Havi megtakarítás céldátum és célösszeg alapján',
    },
    {
      type: 'END_AMOUNT',
      displayName: 'Végösszeg számítás',
    },
  ];

  simulationForm = this.formBuilder.group({
    calculationType: this.formBuilder.nonNullable.control(this.CALCULATION_TYPES[0], Validators.required),
    startingAmount: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.startingAmount.MIN),
      Validators.max(this.VALIDATION_VALUES.startingAmount.MAX),
    ]),
    interestRate: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.interestRate.MIN),
      Validators.max(this.VALIDATION_VALUES.interestRate.MAX),
    ]),
    monthlySavings: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.monthlySavings.MIN),
      Validators.max(this.VALIDATION_VALUES.monthlySavings.MAX),
    ]),
    numberOfMonths: this.formBuilder.control(null as number | null, [
      Validators.required,
      Validators.min(this.VALIDATION_VALUES.numberOfMonths.MIN),
      Validators.max(this.VALIDATION_VALUES.numberOfMonths.MAX),
    ]),
    goalAmount: this.formBuilder.control(null as number | null),
  });

  calculationResult$ = new BehaviorSubject(null as CalculationResult | null);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.simulationForm.controls.goalAmount.setValidators([
      Validators.required,
      this.goalAmountMin(this.simulationForm.controls.startingAmount),
    ]);
    this.simulationForm.controls.calculationType.valueChanges
      .pipe(startWith(this.simulationForm.controls.calculationType.value), takeUntil(this.destroyed$))
      .subscribe((calculationType) => {
        this.simulationForm.controls.monthlySavings.reset();
        this.simulationForm.controls.goalAmount.reset();
        switch (calculationType.type) {
          case 'MONTHLY_SAVINGS':
            this.simulationForm.controls.goalAmount.enable();
            this.simulationForm.controls.monthlySavings.disable();
            break;
          case 'END_AMOUNT':
            this.simulationForm.controls.goalAmount.disable();
            this.simulationForm.controls.monthlySavings.enable();
            break;
        }
      });
  }

  calculate() {
    const formValue = this.simulationForm.getRawValue();
    let calculationResult: CalculationResult | null = null;
    switch (formValue.calculationType.type) {
      case 'MONTHLY_SAVINGS':
        calculationResult = this.calculateMonthlySavings(
          formValue.startingAmount!,
          formValue.interestRate!,
          formValue.goalAmount!,
          formValue.numberOfMonths!
        );
        break;
      case 'END_AMOUNT':
        calculationResult = this.calculateEndBalance(
          formValue.startingAmount!,
          formValue.interestRate!,
          formValue.monthlySavings!,
          formValue.numberOfMonths!
        );
        break;
      default:
        calculationResult = null;
    }
    this.calculationResult$.next(calculationResult);
  }

  goalAmountMin(startingAmountControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startingAmountControlValue = startingAmountControl.value;
      const goalAmountControlValue = control.value;
      if (startingAmountControlValue !== null && goalAmountControlValue !== null) {
        return goalAmountControlValue < startingAmountControlValue ? { min: true } : null;
      }
      return null;
    };
  }

  private calculateEndBalance(
    startingAmount: number,
    interestRate: number,
    monthlySavings: number,
    numberOfMonths: number
  ): CalculationResult {
    const monthlyInterestRate = interestRate / 12 / 100;

    let currentBalance = startingAmount;
    let balanceByYear: number[] = [];
    let totalMonths = 0;

    for (let month = 1; month <= numberOfMonths; month++) {
      currentBalance += currentBalance * monthlyInterestRate;
      currentBalance += monthlySavings;
      // turn of year
      if (month % 12 === 0) {
        balanceByYear.push(currentBalance);
      }
      totalMonths++;
    }

    // less than a year remaining
    if (totalMonths % 12 !== 0) {
      balanceByYear.push(currentBalance);
    }

    return {
      balanceByYear: balanceByYear,
      result: currentBalance,
    };
  }

  private calculateMonthlySavings(
    startingAmount: number,
    interestRate: number,
    goalAmount: number,
    numberOfMonths: number
  ): CalculationResult {
    const monthlyInterestRate = interestRate / 12 / 100;

    // annuity formula factor
    const factor = (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1) / monthlyInterestRate;
    // monthly savings based on the difference between the goal and starting amounts
    const monthlySavings = (goalAmount - startingAmount * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / factor;

    let currentBalance = startingAmount;
    let balanceByYear: number[] = [];

    // balance by year
    for (let month = 1; month <= numberOfMonths; month++) {
      currentBalance += currentBalance * monthlyInterestRate;
      currentBalance += monthlySavings;

      if (month % 12 === 0 || month === numberOfMonths) {
        balanceByYear.push(currentBalance);
      }
    }

    return {
      balanceByYear: balanceByYear,
      result: monthlySavings,
    };
  }

  reset() {
    this.simulationForm.reset();
    this.calculationResult$.next(null);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
