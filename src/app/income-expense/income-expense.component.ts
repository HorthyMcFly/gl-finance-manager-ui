import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../balance/balance.service';
import { IncomeExpenseService } from './income-expense.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FmPeriod } from '../../models/Api';
import { MatSelectModule } from '@angular/material/select';
import { first, shareReplay, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { PeriodService } from '../period/period.service';

@Component({
  selector: 'glfm-income-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, IncomeComponent, ExpenseComponent],
  providers: [IncomeExpenseService],
  templateUrl: './income-expense.component.html',
  styleUrls: ['./income-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeExpenseComponent {
  periods$ = this.periodService.periods$.pipe(
    tap((periods) => {
      const activePeriod = periods?.find((period) => period.active) ?? null;
      this.incomeExpenseService.setSelectedPeriod(activePeriod);
      this.periodSelectControl.setValue(activePeriod);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  periodSelectControl = this.formBuilder.control(null as FmPeriod | null);

  constructor(
    public balanceService: BalanceService,
    public incomeExpenseService: IncomeExpenseService,
    public periodService: PeriodService,
    private formBuilder: FormBuilder
  ) {}
}
