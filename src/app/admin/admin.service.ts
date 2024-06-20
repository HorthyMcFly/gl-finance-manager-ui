import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';
import { FmUserDto } from '../../models/Api';

@Injectable()
export class AdminService {
  #users$ = new BehaviorSubject<FmUserDto[] | null>(null);
  users$ = this.http.get<FmUserDto[]>('api/admin/users').pipe(
    tap((users) => this.#users$.next(users)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#users$.pipe(map((users) => (users ? users : []))))
  );

  constructor(private http: HttpClient) {}

  createUser(user: FmUserDto) {
    return this.http.post<FmUserDto>('api/admin/user', user);
  }

  addUser(user: FmUserDto) {
    this.#users$.next([...(this.#users$.value ?? []), user]);
  }

  modifyUser(user: FmUserDto) {
    return this.http.put<FmUserDto>('api/admin/user', user);
  }

  updateUser(user: FmUserDto) {
    const users = this.#users$.value ?? [];
    this.#users$.next(users.map((u) => (u.id === user.id ? user : u)));
  }

  closeActivePeriod() {
    return this.http.post('api/admin/close-active-period', {});
  }
  
}
