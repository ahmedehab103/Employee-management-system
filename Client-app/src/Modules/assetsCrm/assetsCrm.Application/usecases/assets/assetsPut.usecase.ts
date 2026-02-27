import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import { Asset } from '../../../assetsCrm.Domain/asset';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsPutUseCase implements UseCaseWithOutOutPut<Asset> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(asset: Asset): Observable<object> {
    return this._assetsRepository.put(asset);
  }
}

const AssetsPutProviders = [assetsRepositoryProvider, AssetsPutUseCase];
export { AssetsPutUseCase, AssetsPutProviders };
