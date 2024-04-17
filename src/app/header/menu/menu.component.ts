import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}
@Component({
  selector: 'glfm-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatMenuModule, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  private _menuItems: MenuItem[] = [
    {
      path: 'dashboard',
      label: 'Áttekintő',
      icon: 'dashboard',
    },
    {
      path: 'incomeexpense',
      label: 'Bevételek-Kiadások',
      icon: 'balance',
    },
  ];

  private _adminMenuItems: MenuItem[] = [
    {
      path: 'admin',
      label: 'Felhasználók kezelése',
      icon: 'admin_panel_settings',
    },
  ];

  menuItems$ = of(this._menuItems);
  adminMenuItems$ = of(this._adminMenuItems);

  constructor(public authService: AuthService, private router: Router) {}

  handleClick(menuItem: MenuItem) {
    this.router.navigate([menuItem.path]);
  }
}
