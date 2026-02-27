import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import {
  AssetsLocationRepository,
  assetsLocationRepositoryProvider,
} from '../../repositories/assetsLocation.repository';

@Injectable()
class AssetLocationDeleteUseCase implements UseCaseWithOutOutPut<string> {
  private readonly _assetslocationRepository: AssetsLocationRepository = inject(
    AssetsLocationRepository
  );

  execute(locationId: string): Observable<object> {
    return this._assetslocationRepository.delete(locationId);
  }
}

const AssetLocationDeleteProviders = [
  assetsLocationRepositoryProvider,
  AssetLocationDeleteUseCase,
];
export { AssetLocationDeleteUseCase, AssetLocationDeleteProviders };
