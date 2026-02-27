import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';
import {
  AssetsLocationRepository,
  assetsLocationRepositoryProvider,
} from '../../repositories/assetsLocation.repository';

@Injectable()
class AssetLocationPostUseCase implements UseCase<AssetLocation, string> {
  private readonly _assetslocationRepository: AssetsLocationRepository = inject(
    AssetsLocationRepository
  );

  execute(location: AssetLocation): Observable<string> {
    return this._assetslocationRepository.post(location);
  }
}

const AssetLocationPostProviders = [
  assetsLocationRepositoryProvider,
  AssetLocationPostUseCase,
];
export { AssetLocationPostUseCase, AssetLocationPostProviders };
