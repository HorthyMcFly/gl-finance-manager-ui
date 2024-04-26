import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, shareReplay, switchMap, tap } from 'rxjs';
import { LoanDto } from '../../models/Api';

@Injectable()
export class LoanService {

  #loans = new BehaviorSubject(null as LoanDto[] | null);
  loans$ = this.http.get<LoanDto[]>('/api/loans').pipe(
    tap((loans) => this.#loans.next(loans)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#loans.pipe(map((loans) => loans ?? [])))
  );

  constructor(private http: HttpClient) { }
}
