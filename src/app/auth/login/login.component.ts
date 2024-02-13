import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: this.formBuilder.control(null as string | null, Validators.required),
    password: this.formBuilder.control(null as string | null, Validators.required),
  });

  constructor(public router: Router, private authService: AuthService, private formBuilder: FormBuilder) {}

  login(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.getRawValue();
      this.authService.login(formValue.username!, formValue.password!).subscribe((response) => {
        sessionStorage.setItem("loggedInUser", response.accessToken);
        this.router.navigate(['dashboard']);
      });
    }
  }
}
