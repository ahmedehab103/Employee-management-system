import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import { Asset } from '../../../assetsCrm.Domain/asset';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsPostUseCase implements UseCase<Asset, string> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  constructor() {}

  execute(asset: Asset): Observable<string> {
    return this._assetsRepository.post(asset);
  }
}

const AssetsPostProviders = [assetsRepositoryProvider, AssetsPostUseCase];
export { AssetsPostUseCase, AssetsPostProviders };
