import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';
import { AssetDto, AssetType } from '../../models/Api';

@Injectable()
export class AssetService {

  #assets = new BehaviorSubject(null as AssetDto[] | null);
  assets$ = this.http.get<AssetDto[]>('/api/assets').pipe(
    tap((assets) => this.#assets.next(assets)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#assets.pipe(map((assets) => assets ?? [])))
  );

  assetTypes$ = this.http.get<AssetType[]>('api/assets/asset-types');

  constructor(private http: HttpClient) { }

  createAsset(assetDto: AssetDto) {
    return this.http.post<AssetDto>('api/assets', assetDto);
  }

  addAsset(assetDto: AssetDto) {
    this.#assets.next([...(this.#assets.value ?? []), assetDto]);
  }

  sellAsset(assetDto: AssetDto) {
    return this.http.put<AssetDto>('api/assets/sell', assetDto);
  }

  updateAsset(assetDto: AssetDto) {
    this.#assets.next(
      this.#assets.value?.map((asset) => {
        if (asset.id === assetDto.id) {
          Object.assign(asset, assetDto);
        }
        return asset;
      }) ?? []
    );
  }

  deleteAsset(assetId: number) {
    return this.http.delete<void>(`api/assets/${assetId}`);
  }

  removeAsset(assetId: number) {
    this.#assets.next(this.#assets.value?.filter((asset) => asset.id !== assetId) ?? []);
  }
}
