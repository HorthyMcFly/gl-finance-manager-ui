import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { DashboardData } from '../../models/Api';

@Injectable()
export class DashboardService {
  dashboardData$ = this.http.get<DashboardData>('/api/dashboard').pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(private http: HttpClient) {}
}
