import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, first, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  registerForm = this.formBuilder.group(
    {
      username: this.formBuilder.control(null as string | null, Validators.required),
      password: this.formBuilder.control(null as string | null, Validators.required),
      confirmPassword: this.formBuilder.control(null as string | null, Validators.required),
    },
    { validators: this.passwordMatchValidator }
  );

  confirmPasswordErrorMessage$!: Observable<string | null>;

  constructor(public router: Router, private authService: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') ?? 'null');
    if (loggedInUser) this.router.navigate(['dashboard']);

    this.confirmPasswordErrorMessage$ = this.registerForm.valueChanges.pipe(
      startWith(this.registerForm.value),
      map(() => {
        return this.registerForm.controls.confirmPassword.hasError('passwordMismatch') ? 'Nem egyező jelszavak!' : null;
      })
    );
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
        .subscribe((loginResponse) => {
          this.authService.setLoggedInUser(loginResponse);
          this.router.navigate(['dashboard']);
        });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as typeof this.registerForm;
    const password = formGroup.controls.password;
    const confirmPassword = formGroup.controls.confirmPassword;

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }
}
