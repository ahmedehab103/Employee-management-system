import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsPutValueIsCurrentUseCase
  implements
    UseCaseWithOutOutPut<{
      assetId: string;
      valueId: string;
    }>
{
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(data: { assetId: string; valueId: string }): Observable<object> {
    return this._assetsRepository.putValueIsCurrent(data);
  }
}

const AssetsPutValueIsCurrentUseCaseProviders = [
  assetsRepositoryProvider,
  AssetsPutValueIsCurrentUseCase,
];
export {
  AssetsPutValueIsCurrentUseCaseProviders,
  AssetsPutValueIsCurrentUseCase,
};
