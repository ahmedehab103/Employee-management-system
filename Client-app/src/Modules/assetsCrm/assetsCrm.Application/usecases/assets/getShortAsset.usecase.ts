import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UseCase } from "../../../../Common/application/use-case";
import { Asset } from "../../../assetsCrm.Domain/asset";
import { AssetsRepository, assetsRepositoryProvider } from "../../repositories/assets.repository";

@Injectable()
class GetShortAssetUseCase implements UseCase<string, Asset> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  constructor() {}

  execute(id: string): Observable<Asset> {
    return this._assetsRepository.getShort(id);
  }
}

const GetShortAssetProviders = [assetsRepositoryProvider, GetShortAssetUseCase];
export { GetShortAssetUseCase, GetShortAssetProviders };

