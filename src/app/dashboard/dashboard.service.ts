import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { DashboardData } from '../../models/Api';
import { environment } from '../../environments/environment';

@Injectable()
export class DashboardService {
  dashboardData$ = this.http
    .get<DashboardData>(`${environment.apiUrl}/dashboard`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(private http: HttpClient) {}
}
