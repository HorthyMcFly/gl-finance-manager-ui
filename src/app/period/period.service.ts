import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, shareReplay, switchMap } from 'rxjs';
import { FmPeriod } from '../../models/Api';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  periods$ = this.http.get<FmPeriod[]>(`${environment.apiUrl}/periods`);

  #loadActivePeriod$ = new BehaviorSubject<void>(undefined);
  activePeriod$ = this.#loadActivePeriod$.pipe(
    switchMap(() => this.http.get<FmPeriod | null>(`${environment.apiUrl}/periods/active`).pipe(first())),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) { }

  
  loadActivePeriod() {
    this.#loadActivePeriod$.next();
  }
}
