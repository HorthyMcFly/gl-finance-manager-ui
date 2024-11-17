import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDto } from '../../../models/Api';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../loan.service';
import { BehaviorSubject } from 'rxjs';

interface LoanRundown {
  feasible: boolean;
  outstandingByYear: number[];
  totalAmountRepaid: number;
}

@Component({
  selector: 'glfm-loan-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDetailsComponent implements AfterContentChecked {
  @Input({ required: true }) loan!: LoanDto;
  @Output() editLoan = new EventEmitter<LoanDto>();
  @Output() deleteLoan = new EventEmitter<LoanDto>();
  loanRundown$ = new BehaviorSubject<LoanRundown | null>(null);

  constructor(public loanService: LoanService) {}

  ngAfterContentChecked(): void {
    this.loanRundown$.next(
      this.calculateLoanDetails(this.loan.amount!, this.loan.interestRate!, this.loan.monthlyRepayment!)
    );
  }

  calculateLoanDetails(
    currentAmount: number,
    interestRate: number,
    monthlyRepayment: number
  ): { feasible: boolean; outstandingByYear: number[]; totalAmountRepaid: number } {
    const outstandingByYear: number[] = [];
    let totalAmountRepaid = 0;

    const monthlyInterestRate = interestRate / 12 / 100;

    const monthlyInterestOnPrincipal = currentAmount * monthlyInterestRate;
    if (monthlyRepayment <= monthlyInterestOnPrincipal) {
      return { feasible: false, outstandingByYear, totalAmountRepaid };
    }

    while (currentAmount > 0) {
      let outstandingAmount = currentAmount;
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = outstandingAmount * monthlyInterestRate;
        outstandingAmount -= monthlyRepayment;
        if (outstandingAmount <= 0) {
          totalAmountRepaid += monthlyRepayment + outstandingAmount;
          outstandingAmount = 0;
          break;
        } else {
          outstandingAmount += monthlyInterest;
          totalAmountRepaid += monthlyRepayment;
        }
      }
      outstandingByYear.push(outstandingAmount);
      currentAmount = outstandingAmount;
    }

    return { feasible: true, outstandingByYear, totalAmountRepaid };
  }
}
