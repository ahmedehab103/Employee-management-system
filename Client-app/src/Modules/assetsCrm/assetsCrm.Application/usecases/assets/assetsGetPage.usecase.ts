import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../../Common/domain/pagination';
import { Asset } from '../../../assetsCrm.Domain/asset';

@Injectable()
class AssetsGetPageUseCase
  implements
    UseCase<
      { params: PaginationParams; projectsIds: string[] },
      PaginationRespons<Asset>
    >
{
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(obj: {
    params: PaginationParams;
    projectsIds: string[];
  }): Observable<PaginationRespons<Asset>> {
    return this._assetsRepository.getPage(obj);
  }
}

const AssetGetPageProviders = [assetsRepositoryProvider, AssetsGetPageUseCase];
export { AssetsGetPageUseCase, AssetGetPageProviders };
