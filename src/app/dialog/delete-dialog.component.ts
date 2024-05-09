import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'glfm-delete-dialog',
  imports: [ MatDialogModule, MatButtonModule ],
  template: `
    <h2 mat-dialog-title>Törlés megerősítése</h2>
    <mat-dialog-content>Biztosan törli?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="onYesClick()">Igen</button>
      <button mat-button (click)="onNoClick()">Nem</button>
    </mat-dialog-actions>
  `,
  standalone: true
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}