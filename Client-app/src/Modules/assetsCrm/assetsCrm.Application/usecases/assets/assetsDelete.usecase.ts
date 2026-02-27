import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import { Asset } from '../../../assetsCrm.Domain/asset';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsDeleteUseCase implements UseCaseWithOutOutPut<string> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(assetId: string): Observable<object> {
    return this._assetsRepository.delete(assetId);
  }
}

const AssetsDeleteProviders = [assetsRepositoryProvider, AssetsDeleteUseCase];
export { AssetsDeleteUseCase, AssetsDeleteProviders };
