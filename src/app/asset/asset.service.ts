import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';
import { AssetDto, AssetInvestmentBalanceDto, AssetType } from '../../models/Api';
import { environment } from '../../environments/environment';

@Injectable()
export class AssetService {
  #assets = new BehaviorSubject(null as AssetDto[] | null);
  assets$ = this.http.get<AssetDto[]>(`${environment.apiUrl}/assets`).pipe(
    tap((assets) => this.#assets.next(assets)),
    shareReplay({ bufferSize: 1, refCount: true }),
    switchMap(() => this.#assets.pipe(map((assets) => assets ?? [])))
  );

  assetTypes$ = this.http.get<AssetType[]>(`${environment.apiUrl}/assets/asset-types`);

  constructor(private http: HttpClient) {}

  createAsset(assetDto: AssetDto) {
    return this.http.post<AssetDto>(`${environment.apiUrl}/assets`, assetDto);
  }

  addAsset(assetDto: AssetDto) {
    this.#assets.next([...(this.#assets.value ?? []), assetDto]);
  }

  sellAsset(assetDto: AssetDto) {
    return this.http.put<AssetDto>(`${environment.apiUrl}/assets/sell`, assetDto);
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
    return this.http.delete<void>(`${environment.apiUrl}/assets/${assetId}`);
  }

  removeAsset(assetId: number) {
    this.#assets.next(this.#assets.value?.filter((asset) => asset.id !== assetId) ?? []);
  }

  investmentBalanceToIncome(amount: number) {
    return this.http.post<void>(`${environment.apiUrl}/assets/investment-balance-to-income`, {
      amount,
    } as AssetInvestmentBalanceDto);
  }
}
