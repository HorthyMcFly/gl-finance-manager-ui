import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { ExpenseCategory, ExpenseDto } from '../../../models/Api';
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

  expenseCategories$ = this.http.get<ExpenseCategory[]>('api/expenses/expense-categories').pipe(
    shareReplay({ bufferSize: 1, refCount: true})
  );

  constructor(private http: HttpClient, private incomeExpenseService: IncomeExpenseService) { }

  createExpense(expenseDto: ExpenseDto) {
    return this.http.post<ExpenseDto>('api/expenses', expenseDto);
  }

  modifyExpense(expenseDto: ExpenseDto) {
    return this.http.put<ExpenseDto>('api/expenses', expenseDto);
  }

  deleteExpense(expenseId: number) {
    return this.http.delete(`api/expenses/${expenseId}`);
  }

  addExpense(expenseDto: ExpenseDto) {
    this.#expenses.next([...(this.#expenses.value ?? []), expenseDto]);
  }

  updateExpense(expenseDto: ExpenseDto) {
    this.#expenses.next(
      this.#expenses.value?.map((expense) => {
        if (expense.id === expenseDto.id) {
          Object.assign(expense, expenseDto);
        }
        return expense;
      }) ?? []
    );
  }

  removeExpense(expenseId: number) {
    this.#expenses.next(this.#expenses.value?.filter((expense) => expense.id !== expenseId) ?? []);
  }
}
