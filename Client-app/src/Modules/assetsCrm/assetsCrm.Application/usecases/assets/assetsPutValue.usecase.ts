import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import { Value } from '../../../assetsCrm.Domain/value';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsPutValueUseCase
  implements UseCaseWithOutOutPut<{ value: Value; report: File }>
{
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(data: { value: Value; report: File }): Observable<object> {
    return this._assetsRepository.putValue(data);
  }
}

const AssetsPutValueProviders = [
  assetsRepositoryProvider,
  AssetsPutValueUseCase,
];
export { AssetsPutValueProviders, AssetsPutValueUseCase };
