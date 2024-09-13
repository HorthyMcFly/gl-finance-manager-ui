import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, switchMap, tap } from 'rxjs';
import { ExpenseCategoryLimitDto } from '../../../../models/Api';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryLimitService {

  #expenseCategoryLimits$ = new BehaviorSubject<ExpenseCategoryLimitDto[]>([]);
  expenseCategoryLimits$ = this.http.get<ExpenseCategoryLimitDto[]>('api/expense-categories/limits').pipe(
    shareReplay({ bufferSize: 1, refCount: true}),
    tap((expenseCategoryLimits) => this.#expenseCategoryLimits$.next(expenseCategoryLimits)),
    switchMap(() => this.#expenseCategoryLimits$)
  );

  constructor(private http: HttpClient) { }
}
