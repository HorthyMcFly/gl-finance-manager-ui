import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, shareReplay, switchMap } from 'rxjs';
import { FmPeriod } from '../../models/Api';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  periods$ = this.http.get<FmPeriod[]>('api/periods');

  #loadActivePeriod$ = new BehaviorSubject<void>(undefined);
  activePeriod$ = this.#loadActivePeriod$.pipe(
    switchMap(() => this.http.get<FmPeriod>('api/periods/active').pipe(first())),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) { }

  
  loadActivePeriod() {
    this.#loadActivePeriod$.next();
  }
}
