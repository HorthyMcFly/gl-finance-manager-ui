import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BalanceDto } from '../../models/Api';
import { BehaviorSubject, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  #balance = new BehaviorSubject(null as BalanceDto | null);
  balance$ = this.http.get<BalanceDto>('/api/balance').pipe(
    tap((balance) => this.#balance.next(balance)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#balance)
  );

  constructor(private http: HttpClient) { }

}
