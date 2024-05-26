import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertmDialogComponent } from '../../dialog/alert-dialog.component';

@Component({
  selector: 'glfm-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: this.formBuilder.control(null as string | null, Validators.required),
    password: this.formBuilder.control(null as string | null, Validators.required),
  });

  constructor(
    public router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') ?? 'null');
    if (loggedInUser) this.router.navigate(['dashboard']);
  }

  login(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.getRawValue();
      this.authService.login(formValue.username!, formValue.password!).subscribe({
        next: (response) => {
          this.authService.setLoggedInUser(response);
          this.router.navigate(['dashboard']);
        },
        error: (error) => {
          const message = error.status === 401 ? 'Hibás felhasználónév vagy jelszó.' : 'Háttérrendszeri hiba.';
          this.dialog.open(AlertmDialogComponent, {
            data: {
              title: 'Hiba!',
              message,
            },
          });
        },
      });
    }
  }
}
