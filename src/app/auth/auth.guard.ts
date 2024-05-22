import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

const USER_ROUTES = ['dashboard', 'incomeexpense', 'asset', 'loan', 'change-password'];
const ADMIN_ROUTES = ['dashboard', 'admin', 'incomeexpense', 'asset', 'loan', 'change-password'];

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loggedInUser$.pipe(
    map((loggedInUser) => {
      if (!loggedInUser) return router.parseUrl('/login');
      switch(loggedInUser.role) {
        case 'ROLE_USER':
          return USER_ROUTES.includes(route?.url[0].toString());
        case 'ROLE_ADMIN':
          return ADMIN_ROUTES.includes(route?.url[0].toString());
      }
      return router.parseUrl('/login');
    })
  );
};
