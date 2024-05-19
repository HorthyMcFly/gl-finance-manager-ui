import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDto } from '../../../models/Api';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../loan.service';

interface LoanRundown {
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
export class LoanDetailsComponent implements OnInit {

  @Input({ required: true }) loan!: LoanDto;
  @Output() editLoan = new EventEmitter<LoanDto>();
  @Output() deleteLoan = new EventEmitter<LoanDto>();
  loanRundown: LoanRundown | undefined;

  constructor(public loanService: LoanService) {}

  ngOnInit(): void {
    this.loanRundown = this.calculateLoanDetails(
      this.loan.amount!,
      this.loan.interestRate!,
      this.loan.monthlyRepayment!
    );
  }

  calculateLoanDetails(
    currentAmount: number,
    interestRate: number,
    monthlyRepayment: number
  ): { outstandingByYear: number[]; totalAmountRepaid: number } {
    const outstandingByYear: number[] = [];
    let totalAmountRepaid = 0;

    const monthlyInterestRate = interestRate / 12 / 100;

    while (currentAmount > 0) {
      let outstandingAmount = currentAmount;
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = outstandingAmount * monthlyInterestRate;
        outstandingAmount -= monthlyRepayment;
        if (outstandingAmount < 0) {
          totalAmountRepaid += Math.abs(outstandingAmount);
          outstandingAmount = 0;
        } else {
          outstandingAmount += monthlyInterest;
          totalAmountRepaid += monthlyRepayment;
        }
      }
      outstandingByYear.push(currentAmount);
      currentAmount = outstandingAmount;
    }

    return { outstandingByYear, totalAmountRepaid };
  }
}
