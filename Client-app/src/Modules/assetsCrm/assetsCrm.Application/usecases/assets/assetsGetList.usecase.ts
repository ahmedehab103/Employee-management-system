import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import { Asset } from '../../../assetsCrm.Domain/asset';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';
import { Company } from '../../../assetsCrm.Domain/company';

@Injectable()
class AssetsGetListUseCase implements UseCaseWithOutInPut<Asset[]> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);


  constructor() {}

  execute(): Observable<Company[]> {
    return this._assetsRepository.getList();
  }
}

const AssetGetListProviders = [assetsRepositoryProvider, AssetsGetListUseCase];
export { AssetsGetListUseCase, AssetGetListProviders };
