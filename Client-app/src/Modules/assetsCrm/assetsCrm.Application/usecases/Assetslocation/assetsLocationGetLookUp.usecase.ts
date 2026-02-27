import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import {
  AssetsLocationRepository,
  assetsLocationRepositoryProvider,
} from '../../repositories/assetsLocation.repository';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';

@Injectable()
class AssetsLocationGetLookUpUseCase
  implements UseCaseWithOutInPut<AssetLocation[]>
{
  private readonly _AssetsLocationRepository: AssetsLocationRepository = inject(
    AssetsLocationRepository
  );

  constructor() {}

  execute(): Observable<AssetLocation[]> {
    return this._AssetsLocationRepository.getLookUpList();
  }
}

const AssetsLocationGetLookUpProviders = [
  assetsLocationRepositoryProvider,
  AssetsLocationGetLookUpUseCase,
];
export { AssetsLocationGetLookUpUseCase, AssetsLocationGetLookUpProviders };
