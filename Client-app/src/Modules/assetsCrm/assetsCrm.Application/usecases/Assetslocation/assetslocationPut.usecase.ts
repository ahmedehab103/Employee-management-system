import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';
import {
  AssetsLocationRepository,
  assetsLocationRepositoryProvider,
} from '../../repositories/assetsLocation.repository';

@Injectable()
class AssetLocationPutUseCase implements UseCaseWithOutOutPut<AssetLocation> {
  private readonly _assetslocationRepository: AssetsLocationRepository = inject(
    AssetsLocationRepository
  );

  constructor() {}

  execute(location: AssetLocation): Observable<object> {
    return this._assetslocationRepository.put(location);
  }
}

const AssetLocationPutProviders = [
  assetsLocationRepositoryProvider,
  AssetLocationPutUseCase,
];
export { AssetLocationPutUseCase, AssetLocationPutProviders };
