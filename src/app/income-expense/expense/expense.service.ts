import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { ExpenseDto } from '../../../models/Api';
import { HttpClient } from '@angular/common/http';
import { IncomeExpenseService } from '../income-expense.service';

@Injectable()
export class ExpenseService {

  #expenses = new BehaviorSubject(null as ExpenseDto[] | null);
  expenses$ = this.incomeExpenseService.selectedPeriod$.pipe(
    filter((selectedPeriod) => selectedPeriod !== null),
    switchMap((selectedPeriod) => this.http.get<ExpenseDto[]>(`/api/expenses/own/periods/${selectedPeriod!.id}`)),
    tap((expenses) => this.#expenses.next(expenses)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#expenses.pipe(map((expenses) => expenses ?? [])))
  );

  constructor(private http: HttpClient, private incomeExpenseService: IncomeExpenseService) { }
}
