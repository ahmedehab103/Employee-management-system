import { Observable } from 'rxjs';
import { Asset } from '../../assetsCrm.Domain/asset';
import { AssetsRepositoryImplementation } from '../../assetsCrm.Infrastructure/repositoryImplementation/Assets.repositoryImplementation';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { Value } from '../../assetsCrm.Domain/value';
import { Company } from '../../assetsCrm.Domain/company';

export abstract class AssetsRepository {
  abstract getPage(obj: {
    params: PaginationParams;
    projectsIds: string[];
  }): Observable<PaginationRespons<Asset>>;

  abstract getList(): Observable<Company[]>; //Use in map

  abstract get(id: string): Observable<Asset>;

  abstract getShort(id: string): Observable<Asset>;

  abstract post(asset: Asset): Observable<string>;

  abstract postValue(data: {
    value: Value;
    report: File | null;
  }): Observable<string>;

  abstract postImage(image: File): Observable<string>;

  abstract postComment(data: {
    assetId: string;
    comment: string;
  }): Observable<string>;

  abstract put(asset: Asset): Observable<object>;

  abstract delete(assetId: string): Observable<object>;

  abstract putValue(data: {
    value: Value;
    report: File | null;
  }): Observable<object>;

  abstract deleteValue(data: {
    assetId: string;
    valueId: string;
  }): Observable<object>;

  abstract putValueIsCurrent(data: {
    assetId: string;
    valueId: string;
  }): Observable<object>;
}

export const assetsRepositoryProvider = {
  provide: AssetsRepository,
  useClass: AssetsRepositoryImplementation,
};
