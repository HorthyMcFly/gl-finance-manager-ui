import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse, RegisterRequest } from '../../models/Api';

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
    })
  );

  login(username: string, password: string): Observable<LoginResponse> {
    const httpOptions = {
      headers: {
        Authorization: 'Basic ' + window.btoa(username + ':' + password),
      },
    };
    return this.http.post<LoginResponse>('/api/auth/login', null, httpOptions);
  }

  register(username: string, password: string): Observable<never> {
    return this.http.post<never>('/api/auth/register', { username, password } as RegisterRequest);
  }

  setLoggedInUser(loggedInUser: LoginResponse | null): void {
    this._loggedInUser$.next(loggedInUser);
  }
}
