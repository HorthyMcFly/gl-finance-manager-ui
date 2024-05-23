import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'glfm-change-password',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  VALIDATION_VALUES = {
    password: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 30,
    },
  };

  changePasswordForm = this.formBuilder.group(
    {
      newPassword: this.formBuilder.control(null as string | null, [
        Validators.required,
        Validators.minLength(this.VALIDATION_VALUES.password.MIN_LENGTH),
        Validators.maxLength(this.VALIDATION_VALUES.password.MAX_LENGTH),
      ]),
      confirmPassword: this.formBuilder.control(null as string | null),
    }
  );

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.changePasswordForm.controls.confirmPassword.addValidators([
      Validators.required,
      this.passwordMatchValidator(this.changePasswordForm.controls.newPassword),
    ]);
  }

  passwordMatchValidator(passwordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return passwordControl.value !== control.value ? { passwordMismatch: true } : null;
    };
  }

  changePassword() {
    if (!this.changePasswordForm.valid) return;
    this.authService.changePassword(this.changePasswordForm.getRawValue().newPassword!).subscribe(() => {
      this.authService.setLoggedInUser(null);
      this.router.navigate(['login']);
    });
  }
}
