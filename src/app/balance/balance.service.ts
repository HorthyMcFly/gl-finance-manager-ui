import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BalanceDto } from '../../models/Api';
import { BehaviorSubject, first, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  #loadBalance = new BehaviorSubject<void>(undefined);
  loadBalance$ = this.#loadBalance.asObservable();

  balance$ = this.loadBalance$.pipe(
    switchMap(() => {
      return this.http.get<BalanceDto>('/api/balance').pipe(first());
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) {}

  reloadBalance() {
    this.#loadBalance.next();
  }
}
