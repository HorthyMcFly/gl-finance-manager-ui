import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BalanceDto } from '../../models/Api';
import { BehaviorSubject, first, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  #loadBalance = new BehaviorSubject<void>(undefined);
  loadBalance$ = this.#loadBalance.asObservable();

  balance$ = this.loadBalance$.pipe(
    switchMap(() => {
      return this.http.get<BalanceDto>(`${environment.apiUrl}/balance`).pipe(first());
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) {}

  reloadBalance() {
    this.#loadBalance.next();
  }
}
