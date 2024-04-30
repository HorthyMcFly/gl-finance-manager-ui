import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'glfm-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  providers: [DashboardService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  constructor(public dashboardService: DashboardService) {}

}
