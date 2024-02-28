import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, first, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('login')) {
      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.handleErrorRes(error)));
    }
    return this.authService.loggedInUser$
      .pipe(
        first(),
        switchMap((loggedInUser) => {
          if (loggedInUser?.accessToken) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${loggedInUser?.accessToken}`,
              },
            });
          }
          return next.handle(request);
        })
      )
      .pipe(catchError((error: HttpErrorResponse) => this.handleErrorRes(error)));
  }

  private handleErrorRes(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.authService.setLoggedInUser(null);
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
    return throwError(() => error);
  }
}
