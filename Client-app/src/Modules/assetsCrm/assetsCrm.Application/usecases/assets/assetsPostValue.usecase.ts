import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import { Value } from '../../../assetsCrm.Domain/value';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsPostValueUseCase
  implements UseCase<{ value: Value; report: File | null }, string>
{
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(data: { value: Value; report: File | null }): Observable<string> {
    return this._assetsRepository.postValue(data);
  }
}

const AssetsPostValueProviders = [
  assetsRepositoryProvider,
  AssetsPostValueUseCase,
];
export { AssetsPostValueUseCase, AssetsPostValueProviders };
