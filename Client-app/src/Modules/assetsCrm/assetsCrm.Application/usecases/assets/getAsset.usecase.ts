import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import { Asset } from '../../../assetsCrm.Domain/asset';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class GetAssetUseCase implements UseCase<string, Asset> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(id: string): Observable<Asset> {
    return this._assetsRepository.get(id);
  }
}

const GetAssetProviders = [assetsRepositoryProvider, GetAssetUseCase];
export { GetAssetUseCase, GetAssetProviders };