import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FmPeriod } from '../../models/Api';
import { BehaviorSubject, combineLatest, map, shareReplay, tap } from 'rxjs';

@Injectable()
export class IncomeExpenseService {
  periods$ = this.http.get<FmPeriod[]>('api/periods').pipe(shareReplay({ bufferSize: 1, refCount: true }));
  #selectedPeriod$ = new BehaviorSubject<FmPeriod | null>(null);
  selectedPeriod$ = this.#selectedPeriod$.asObservable();

  underEdit$ = new BehaviorSubject(false);

  buttonsDisabled$ = combineLatest([this.underEdit$, this.selectedPeriod$]).pipe(
    map(([underEdit, selectedPeriod]) => underEdit || selectedPeriod === null || !selectedPeriod.active),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) {}

  setSelectedPeriod(period: FmPeriod | null) {
    this.#selectedPeriod$.next(period);
  }
}
