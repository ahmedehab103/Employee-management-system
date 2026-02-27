import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import {
  AssetsLocationRepository,
  assetsLocationRepositoryProvider,
} from '../../repositories/assetsLocation.repository';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';

@Injectable()
class AssetslocationListUseCase
  implements UseCaseWithOutInPut<AssetLocation[]>
{
  private readonly _assetslocationRepository: AssetsLocationRepository = inject(
    AssetsLocationRepository
  );

  execute(): Observable<AssetLocation[]> {
    return this._assetslocationRepository.getList();
  }
}

const AssetslocationGetListProviders = [
  assetsLocationRepositoryProvider,
  AssetslocationListUseCase,
];
export { AssetslocationListUseCase, AssetslocationGetListProviders };
