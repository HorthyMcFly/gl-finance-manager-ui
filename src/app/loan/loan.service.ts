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

  underEdit$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  createLoan(loanDto: LoanDto) {
    return this.http.post<LoanDto>('api/loans', loanDto);
  }

  modifyLoan(loanDto: LoanDto) {
    return this.http.put<LoanDto>('api/loans', loanDto);
  }

  deleteLoan(loanId: number) {
    return this.http.delete(`api/loans/${loanId}`);
  }

  addLoan(loanDto: LoanDto) {
    this.#loans.next([...(this.#loans.value ?? []), loanDto]);
  }

  updateLoan(loanDto: LoanDto) {
    this.#loans.next(
      this.#loans.value?.map((loan) => {
        if (loan.id === loanDto.id) {
          Object.assign(loan, loanDto);
        }
        return loan;
      }) ?? []
    );
  }

  removeLoan(loanId: number) {
    this.#loans.next(this.#loans.value?.filter((loan) => loan.id !== loanId) ?? []);
  }
}
