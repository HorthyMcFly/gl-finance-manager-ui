import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, shareReplay, switchMap, tap } from 'rxjs';
import { FmPeriod, FmUser } from '../../models/Api';

@Injectable()
export class AdminService {
  #users$ = new BehaviorSubject<FmUser[] | null>(null);
  users$ = this.http.get<FmUser[]>('api/admin/users').pipe(
    tap((users) => this.#users$.next(users)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#users$.pipe(map((users) => (users ? users : []))))
  );

  constructor(private http: HttpClient) {}

  createUser(user: FmUser) {
    return this.http.post<FmUser>('api/admin/user', user);
  }

  addUser(user: FmUser) {
    this.#users$.next([...(this.#users$.value ?? []), user]);
  }

  modifyUser(user: FmUser) {
    return this.http.put<FmUser>('api/admin/user', user);
  }

  updateUser(user: FmUser) {
    const users = this.#users$.value ?? [];
    this.#users$.next(users.map((u) => (u.id === user.id ? user : u)));
  }

  closeActivePeriod() {
    return this.http.post('api/admin/close-active-period', {});
  }
  
}
