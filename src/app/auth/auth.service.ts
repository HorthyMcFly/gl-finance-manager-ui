import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { LoginResponse, RegisterRequest, ChangePasswordRequest } from '../../models/Api';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private _loggedInUser$ = new BehaviorSubject<LoginResponse | null>(
    JSON.parse(localStorage.getItem('loggedInUser') ?? 'null')
  );
  loggedInUser$ = this._loggedInUser$.pipe(
    tap((loggedInUser) => {
      if (loggedInUser === null) {
        localStorage.removeItem('loggedInUser');
      } else {
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  login(username: string, password: string): Observable<LoginResponse> {
    const httpOptions = {
      headers: {
        Authorization: 'Basic ' + window.btoa(username + ':' + password),
      },
    };
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, null, httpOptions);
  }

  register(username: string, password: string): Observable<never> {
    return this.http.post<never>(`${environment.apiUrl}/auth/register`, { username, password } as RegisterRequest);
  }

  setLoggedInUser(loggedInUser: LoginResponse | null): void {
    this._loggedInUser$.next(loggedInUser);
  }

  changePassword(newPassword: string): Observable<never> {
    return this.http.post<never>(`${environment.apiUrl}/auth/change-password`, {
      newPassword,
    } as ChangePasswordRequest);
  }
}
