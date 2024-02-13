import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let token = sessionStorage.getItem("loggedInUser");
      if (token) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              },
          });
      }

      return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => this.handleErrorRes(error))
      );
  }

  private handleErrorRes(error: HttpErrorResponse): Observable<never> {
      if (error.status === 401) {
          this.router.navigateByUrl("/login", {replaceUrl: true});
      }
      return throwError(() => error);
  }
}
