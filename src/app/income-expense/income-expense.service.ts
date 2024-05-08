import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FmPeriod } from '../../models/Api';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';

@Injectable()
export class IncomeExpenseService {
  periods$ = this.http.get<FmPeriod[]>('api/periods').pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  #selectedPeriod$ = new BehaviorSubject<FmPeriod | null>(null);
  selectedPeriod$ = this.#selectedPeriod$.asObservable();

  underEdit$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  setSelectedPeriod(period: FmPeriod | null) {
    this.#selectedPeriod$.next(period);
  }
}
