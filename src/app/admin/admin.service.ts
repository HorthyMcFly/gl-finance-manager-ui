import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';
import { FmUserDto } from '../../models/Api';
import { environment } from '../../environments/environment';

@Injectable()
export class AdminService {
  #users$ = new BehaviorSubject<FmUserDto[] | null>(null);
  users$ = this.http.get<FmUserDto[]>(`${environment.apiUrl}/admin/users`).pipe(
    tap((users) => this.#users$.next(users)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#users$.pipe(map((users) => (users ? users : []))))
  );

  constructor(private http: HttpClient) {}

  createUser(user: FmUserDto) {
    return this.http.post<FmUserDto>(`${environment.apiUrl}/admin/user`, user);
  }

  addUser(user: FmUserDto) {
    this.#users$.next([...(this.#users$.value ?? []), user]);
  }

  modifyUser(user: FmUserDto) {
    return this.http.put<FmUserDto>(`${environment.apiUrl}/admin/user`, user);
  }

  updateUser(user: FmUserDto) {
    const users = this.#users$.value ?? [];
    this.#users$.next(users.map((u) => (u.id === user.id ? user : u)));
  }

  createFirstPeriod() {
    return this.http.post(`${environment.apiUrl}/admin/create-first-period`, {});
  }

  closeActivePeriod() {
    return this.http.post(`${environment.apiUrl}/admin/close-active-period`, {});
  }
  
}
