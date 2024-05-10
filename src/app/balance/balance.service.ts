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

  #balance = new BehaviorSubject(null as BalanceDto | null);
  balance$ = this.loadBalance$.pipe(
    switchMap(() => {
      return this.http.get<BalanceDto>('/api/balance').pipe(
        first(),
        tap((balance) => this.#balance.next(balance)),
        shareReplay({ bufferSize: 1, refCount: true }),
        switchMap(() => this.#balance)
      );
    })
  );

  constructor(private http: HttpClient) {}

  reloadBalance() {
    this.#loadBalance.next();
  }
}
