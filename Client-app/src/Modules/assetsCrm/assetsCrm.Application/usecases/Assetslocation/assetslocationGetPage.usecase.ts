import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../../Common/domain/pagination';
import {
  AssetsLocationRepository,
  assetsLocationRepositoryProvider,
} from '../../repositories/assetsLocation.repository';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';

@Injectable()
class AssetLocationGetPageUseCase
  implements UseCase<PaginationParams, PaginationRespons<AssetLocation>>
{
  private readonly _assetslocationRepository: AssetsLocationRepository = inject(
    AssetsLocationRepository
  );
  execute(
    params: PaginationParams
  ): Observable<PaginationRespons<AssetLocation>> {
    return this._assetslocationRepository.getPage(params);
  }
}

const AssetslocationGetPageProviders = [
  assetsLocationRepositoryProvider,
  AssetLocationGetPageUseCase,
];
export { AssetLocationGetPageUseCase, AssetslocationGetPageProviders };
