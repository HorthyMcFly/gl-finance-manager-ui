import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from './loan.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoanDetailsComponent } from './loan-details/loan-details.component';

@Component({
  selector: 'glfm-loan',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, LoanDetailsComponent],
  providers: [LoanService],
  host: { class: 'glfm-loan' },
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent {

  constructor(public loanService: LoanService) { }

}
