import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return sessionStorage.getItem('app.token') != null;
  }

  // TODO: use swagger
  login(username: string, password: string): Observable<{ username: string, accessToken: string}> {
    const httpOptions = {
      headers: {
        Authorization: 'Basic ' + window.btoa(username + ':' + password),
      }
    };
    return this.http.post<{ username: string, accessToken: string}>('/api/auth/login', null, httpOptions);
  }

  register(username: string, password: string): Observable<never> {
    return this.http.post<never>('/api/auth/register', { username, password });
  }

  logout() {
    sessionStorage.removeItem('app.token');
    sessionStorage.removeItem('app.roles');
  }

  isUserInRole(roleFromRoute: string) {
    const roles = sessionStorage.getItem('app.roles');

    if (roles!.includes(',')) {
      if (roles === roleFromRoute) {
        return true;
      }
    } else {
      const roleArray = roles!.split(',');
      for (let role of roleArray) {
        if (role === roleFromRoute) {
          return true;
        }
      }
    }
    return false;
  }
}
