import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
export class ChangePasswordComponent {
  changePasswordForm = this.formBuilder.group(
    {
      newPassword: this.formBuilder.control(null as string | null, Validators.required),
      confirmPassword: this.formBuilder.control(null as string | null, Validators.required),
    },
    { validators: this.passwordMatchValidator }
  );

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as typeof this.changePasswordForm;
    const password = formGroup.controls.newPassword;
    const confirmPassword = formGroup.controls.confirmPassword;

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  changePassword() {
    if (!this.changePasswordForm.valid) return;
    this.authService.changePassword(this.changePasswordForm.getRawValue().newPassword!).subscribe(() => {
      this.authService.setLoggedInUser(null);
      this.router.navigate(['login']);
    });
  }
}
