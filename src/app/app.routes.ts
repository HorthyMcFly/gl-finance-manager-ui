import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authGuard],
  },
  {
    path: 'incomeexpense',
    loadComponent: () => import('./income-expense/income-expense.component').then((m) => m.IncomeExpenseComponent),
    canActivate: [authGuard],
  },
  {
    path: 'asset',
    loadComponent: () => import('./asset/asset.component').then((m) => m.AssetComponent),
    canActivate: [authGuard],
  },
  {
    path: 'loan',
    loadComponent: () => import('./loan/loan.component').then((m) => m.LoanComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
