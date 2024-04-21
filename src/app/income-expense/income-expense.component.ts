import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../balance/balance.service';
import { IncomeExpenseService } from './income-expense.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FmPeriod } from '../../models/Api';
import { MatSelectModule } from '@angular/material/select';
import { tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'glfm-income-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  providers: [IncomeExpenseService],
  templateUrl: './income-expense.component.html',
  styleUrls: ['./income-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeExpenseComponent {
  periods$ = this.incomeExpenseService.periods$.pipe(
    tap((periods) => {
      const activePeriod = periods?.find((period) => period.active) ?? null;
      this.incomeExpenseService.setSelectedPeriod(activePeriod);
      this.periodSelectControl.setValue(activePeriod);
    })
  );

  periodSelectControl = this.formBuilder.control(null as FmPeriod | null);

  constructor(
    public incomeExpenseService: IncomeExpenseService,
    public balanceService: BalanceService,
    private formBuilder: FormBuilder
  ) {}
}
