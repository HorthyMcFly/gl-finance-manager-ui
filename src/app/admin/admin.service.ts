import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, switchMap, tap } from 'rxjs';
import { FmUser } from '../../models/Api';

@Injectable()
export class AdminService {
  #users$ = new BehaviorSubject<FmUser[] | null>(null);
  users$ = this.http.get<FmUser[]>('api/admin/users').pipe(
    tap((users) => this.#users$.next(users)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) {}

  createUser(user: FmUser) {
    return this.http.post('api/admin/users', user);
  }
}
