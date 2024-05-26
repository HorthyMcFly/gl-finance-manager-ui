import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'glfm-alert-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="onYesClick()">OK</button>
    </mat-dialog-actions>
  `,
  standalone: true,
})
export class AlertmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
