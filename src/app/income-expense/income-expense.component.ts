import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'glfm-income-expense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income-expense.component.html',
  styleUrls: ['./income-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeExpenseComponent {

}
