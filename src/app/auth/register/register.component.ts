import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first, switchMap } from 'rxjs';

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
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    username: this.formBuilder.control(null as string | null, Validators.required),
    password: this.formBuilder.control(null as string | null, Validators.required),
    confirmPassword: this.formBuilder.control(null as string | null, Validators.required),
  });

  constructor(public router: Router, private authService: AuthService, private formBuilder: FormBuilder) {}

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
          sessionStorage.setItem('loggedInUser', loginResponse.accessToken);
          this.router.navigate(['dashboard']);
        });
    }
  }
}
