import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, switchMap, tap } from 'rxjs';
import { ExpenseCategoryLimitDto } from '../../../../models/Api';

@Injectable()
export class ExpenseCategoryLimitService {
  #expenseCategoryLimits$ = new BehaviorSubject<ExpenseCategoryLimitDto[]>([]);
  expenseCategoryLimits$ = this.http.get<ExpenseCategoryLimitDto[]>('api/expense-categories/limits').pipe(
    tap((expenseCategoryLimits) => this.#expenseCategoryLimits$.next(expenseCategoryLimits)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#expenseCategoryLimits$)
  );

  constructor(private http: HttpClient) {}

  createExpenseCategoryLimit(expenseCategoryLimitDto: ExpenseCategoryLimitDto) {
    return this.http.post<ExpenseCategoryLimitDto>('api/expense-categories/limits', expenseCategoryLimitDto);
  }

  addExpenseCategoryLimit(expenseCategoryLimitDto: ExpenseCategoryLimitDto) {
    this.#expenseCategoryLimits$.next([...(this.#expenseCategoryLimits$.value ?? []), expenseCategoryLimitDto]);
  }

  modifyExpenseCategoryLimit(expenseCategoryLimitDto: ExpenseCategoryLimitDto) {
    return this.http.put<ExpenseCategoryLimitDto>('api/expense-categories/limits', expenseCategoryLimitDto);
  }

  updateExpenseCategoryLimit(expenseCategoryLimitDto: ExpenseCategoryLimitDto) {
    this.#expenseCategoryLimits$.next(
      this.#expenseCategoryLimits$.value?.map((expenseCategoryLimit) => {
        if (expenseCategoryLimit.id === expenseCategoryLimitDto.id) {
          Object.assign(expenseCategoryLimit, expenseCategoryLimitDto);
        }
        return expenseCategoryLimit;
      }) ?? []
    );
  }

  deleteExpenseCategoryLimit(expenseCategoryLimitId: number) {
    return this.http.delete<void>(`api/expense-categories/limits/${expenseCategoryLimitId}`);
  }

  removeExpenseCategoryLimit(expenseCategoryLimitId: number) {
    this.#expenseCategoryLimits$.next(
      this.#expenseCategoryLimits$.value?.filter((asset) => asset.id !== expenseCategoryLimitId) ?? []
    );
  }
}
