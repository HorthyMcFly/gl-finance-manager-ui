import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { IncomeDto } from '../../../models/Api';
import { HttpClient } from '@angular/common/http';
import { IncomeExpenseService } from '../income-expense.service';

@Injectable()
export class IncomeService {

  #incomes = new BehaviorSubject(null as IncomeDto[] | null);
  incomes$ = this.incomeExpenseService.selectedPeriod$.pipe(
    filter((selectedPeriod) => selectedPeriod !== null),
    switchMap((selectedPeriod) => this.http.get<IncomeDto[]>(`/api/incomes/own/periods/${selectedPeriod!.id}`)),
    tap((incomes) => this.#incomes.next(incomes)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#incomes.pipe(map((incomes) => incomes ?? [])))
  );

  constructor(private http: HttpClient, private incomeExpenseService: IncomeExpenseService) { }
}
