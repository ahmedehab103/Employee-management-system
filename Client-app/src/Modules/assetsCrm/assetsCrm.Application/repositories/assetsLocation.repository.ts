import { Observable } from 'rxjs';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { AssetLocation } from '../../assetsCrm.Domain/assetLocation';
import { AssetsLocationRepositoryImplementation } from '../../assetsCrm.Infrastructure/repositoryImplementation/assetsLocation.repositoryImplementation';

export abstract class AssetsLocationRepository {
  abstract getPage(
    params: PaginationParams
  ): Observable<PaginationRespons<AssetLocation>>;

  abstract getList(): Observable<AssetLocation[]>;

  abstract getLookUpList(): Observable<AssetLocation[]>;

  abstract get(id: string): Observable<AssetLocation>;

  abstract post(assetLocation: AssetLocation): Observable<string>;

  abstract put(assetLocation: AssetLocation): Observable<object>;

  abstract delete(assetLocationId: string): Observable<object>;
}

export const assetsLocationRepositoryProvider = {
  provide: AssetsLocationRepository,
  useClass: AssetsLocationRepositoryImplementation,
};
