import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AssetService } from './asset.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'glfm-asset',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTableModule],
  providers: [AssetService],
  host: { class: 'glfm-asset' },
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetComponent {
  columns: string[] = ['amount', 'name', 'assetType', 'maturityDate', 'interestRate', 'interestPaymentDate', 'sell'];

  constructor(public assetService: AssetService) {}
}
