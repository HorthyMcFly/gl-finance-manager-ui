import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MenuComponent } from './menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'glfm-header',
  standalone: true,
  providers: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MenuComponent,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.setLoggedInUser(null);
    this.router.navigate(['login']);
  }
}
