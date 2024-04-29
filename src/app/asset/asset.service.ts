import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';
import { AssetDto } from '../../models/Api';

@Injectable()
export class AssetService {

  #assets = new BehaviorSubject(null as AssetDto[] | null);
  assets$ = this.http.get<AssetDto[]>('/api/assets').pipe(
    tap((assets) => this.#assets.next(assets)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#assets.pipe(map((assets) => assets ?? [])))
  );

  constructor(private http: HttpClient) { }
}
