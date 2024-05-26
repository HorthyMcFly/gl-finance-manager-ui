import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first, switchMap } from 'rxjs';
import { AlertmDialogComponent } from '../../dialog/alert-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'glfm-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  VALIDATION_VALUES = {
    username: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 20,
    },
    password: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 30,
    },
  };

  registerForm = this.formBuilder.group({
    username: this.formBuilder.control(null as string | null, [
      Validators.required,
      Validators.minLength(this.VALIDATION_VALUES.username.MIN_LENGTH),
      Validators.maxLength(this.VALIDATION_VALUES.username.MAX_LENGTH),
    ]),
    password: this.formBuilder.control(null as string | null, [
      Validators.required,
      Validators.minLength(this.VALIDATION_VALUES.password.MIN_LENGTH),
      Validators.maxLength(this.VALIDATION_VALUES.password.MAX_LENGTH),
    ]),
    confirmPassword: this.formBuilder.control(null as string | null),
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
    this.registerForm.controls.confirmPassword.addValidators([
      Validators.required,
      this.passwordMatchValidator(this.registerForm.controls.password),
    ]);
  }

  register(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.getRawValue();
      this.authService
        .register(formValue.username!, formValue.password!)
        .pipe(
          switchMap(() => {
            return this.authService.login(formValue.username!, formValue.password!);
          }),
          first()
        )
        .subscribe({
          next: (loginResponse) => {
            this.authService.setLoggedInUser(loginResponse);
            this.router.navigate(['dashboard']);
          },
          error: (error) => {
            const message = error.status === 409 ? 'Már létezik ilyen névvel felhasználó.' : 'Háttérrendszeri hiba.';
            this.dialog.open(AlertmDialogComponent, {
              data: {
                title: 'Hiba!',
                message: message,
              },
            });
          },
        });
    }
  }

  passwordMatchValidator(passwordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return passwordControl.value !== control.value ? { passwordMismatch: true } : null;
    };
  }

  back() {
    this.router.navigate(['login']);
  }
}
