import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get('/api/dashboard');
  }
}
