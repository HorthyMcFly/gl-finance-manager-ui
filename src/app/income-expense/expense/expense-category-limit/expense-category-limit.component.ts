import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../expense.service';
import { MatCardModule } from '@angular/material/card';
import { ExpenseCategoryLimitService } from './expense-category-limit.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'glfm-expense-category-limit',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './expense-category-limit.component.html',
  styleUrls: ['./expense-category-limit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCategoryLimitComponent {
  expenseCategoryLimitsWithCurrentSpending$ = combineLatest([
    this.expenseCategoryLimitService.expenseCategoryLimits$,
    this.expenseService.expenses$,
  ]).pipe(
    map(([expenseCategoryLimits, expenses]) => {
      return expenseCategoryLimits.map((expenseCategoryLimit) => {
        const currentSpending = expenses
          .filter((expense) => expense.expenseCategory.id === expenseCategoryLimit.expenseCategory.id)
          .reduce((acc, expense) => acc + expense.amount, 0);
        const overSpent = currentSpending > expenseCategoryLimit.expenseLimit;
        return {
          ...expenseCategoryLimit,
          currentSpending,
          overSpent,
        };
      });
    })
  );

  constructor(
    public expenseCategoryLimitService: ExpenseCategoryLimitService,
    private expenseService: ExpenseService
  ) {}
}
