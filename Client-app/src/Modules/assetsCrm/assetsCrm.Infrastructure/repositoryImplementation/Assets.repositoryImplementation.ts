import { inject, Injectable } from '@angular/core';
import { AssetsRepository } from '../../assetsCrm.Application/repositories/assets.repository';
import { map, Observable } from 'rxjs';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { Asset } from '../../assetsCrm.Domain/asset';
import { Value } from '../../assetsCrm.Domain/value';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AssetDto, AssetDtoMapper } from '../models/assets/assetDto';
import { AssetVm, AssetVmMapper, CompanyGroup } from '../models/assets/assetVm';
import { Company } from '../../assetsCrm.Domain/company';

@Injectable()
export class AssetsRepositoryImplementation implements AssetsRepository {
  private readonly _httpClient = inject(HttpClient);

  getPage(obj: {
    params: PaginationParams;
    projectsIds: string[];
  }): Observable<PaginationRespons<Asset>> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Assets/GetPage`, {
        params: {
          offset: obj.params.offset ?? 0,
          pageIndex: obj.params.pageIndex,
          search: obj.params.search ?? '',
          ascending: obj.params.ascending ?? true,
          sortBy: obj.params.sortBy ?? '',
          projectsIds: obj.projectsIds,
        },
      })
      .pipe(
        map((data) => {
          let respons: PaginationRespons<AssetDto> =
            data as PaginationRespons<AssetDto>;

          const items: Asset[] = respons.items.map((c) =>
            AssetDtoMapper.Map().mapFrom(c)
          );

          return {
            pageInfo: respons.pageInfo,
            items: items,
          };
        })
      );
  }

  getList(): Observable<Company[]> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Assets/GetList`)
      .pipe(
        map((data) => {
          let respons: CompanyGroup[] = data as CompanyGroup[];

          const items: Company[] = respons.map((c) => {
            return {
              id: c.id,
              projects: c.projects.map((p) => {
                return {
                  id: p.id,
                  translatedName: p.name,
                  assets: p.assets.map((a) => {
                    return {
                      id: a.id,
                      pointOnMap: a.pointOnMap,
                    };
                  }),
                };
              }),
            };
          });

          return items;
        })
      );
  }

  get(id: string): Observable<Asset> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Assets?id=${id}`)
      .pipe(
        map((data) => {
          let respons: AssetDto = data as AssetDto;

          return AssetDtoMapper.Map().mapFrom(respons);
        })
      );
  }

  getShort(id: string): Observable<Asset> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Assets/GetShortAsset?id=${id}`)
      .pipe(
        map((data) => {
          let respons: AssetVm = data as AssetVm;

          return AssetVmMapper.Map().mapFrom(respons);
        })
      );
  }

  post(asset: Asset): Observable<string> {
    return this._httpClient
      .post(
        `${environment.apiUrl}/v1/AdminPanel/Assets`,
        JSON.stringify(AssetDtoMapper.Map().mapTo(asset))
      )
      .pipe(map((data) => data as string));
  }

  postValue(data: { value: Value; report: File | null }): Observable<string> {
    const content_ = new FormData();

    const params = {
      AssetId: data.value.assetId,
      value: data.value.value,
      IsFinal: data.value.isFinal,
      Detailed: data.value.detailed,
      IsRental: data.value.isRental,
    };
    if (data.report) content_.append('Report', data.report, data.report.name);

    return this._httpClient
      .post(`${environment.apiUrl}//v1/AdminPanel/Assets/PostValue`, content_, {
        headers: new HttpHeaders({ 'Skip-Content-Type': '1' }),
        params: params,
      })
      .pipe(map((data) => data as string));
  }

  postImage(image: File): Observable<string> {
    const content_ = new FormData();

    content_.append('File', image, image.name ?? 'image');

    content_.append('FileType', '0');

    return this._httpClient
      .post(`${environment.apiUrl}/v1/AdminPanel/Assets/PostFile`, content_, {
        headers: new HttpHeaders({ 'Skip-Content-Type': '1' }),
      })
      .pipe(map((data) => data as string));
  }

  postComment(data: { assetId: string; comment: string }): Observable<string> {
    return this._httpClient
      .post(
        `${environment.apiUrl}/v1/AdminPanel/Assets/PostComment`,
        JSON.stringify({
          assetId: data.assetId,
          text: data.comment,
        })
      )
      .pipe(map((data) => data as string));
  }

  put(asset: Asset): Observable<object> {
    return this._httpClient.put(
      `${environment.apiUrl}/v1/AdminPanel/Assets`,
      JSON.stringify(AssetDtoMapper.Map().mapTo(asset))
    );
  }

  delete(assetId: string): Observable<object> {
    return this._httpClient.delete(
      `${environment.apiUrl}/v1/AdminPanel/Assets/DeleteAsset`,
      {
        params: {
          id: assetId,
        },
      }
    );
  }

  putValue(data: { value: Value; report: File }): Observable<object> {
    const content_ = new FormData();

    if (data.report) content_.append('Report', data.report, data.report.name);

    const params = {
      ValueId: data.value.id,
      AssetId: data.value.assetId,
      value: data.value.value,
      IsFinal: data.value.isFinal,
      Detailed: data.value.detailed,
      IsRental: data.value.isRental,
    };

    return this._httpClient.put(
      `${environment.apiUrl}//v1/AdminPanel/Assets/PutValue`,
      content_,
      {
        headers: new HttpHeaders({ 'Skip-Content-Type': '1' }),
        params: params,
      }
    );
  }
  deleteValue(data: { assetId: string; valueId: string }): Observable<object> {
    const params = {
      ValueId: data.valueId,
      AssetId: data.assetId,
    };

    return this._httpClient.delete(
      `${environment.apiUrl}//v1/AdminPanel/Assets/DeleteValue`,
      {
        params: params,
      }
    );
  }

  putValueIsCurrent(data: {
    assetId: string;
    valueId: string;
  }): Observable<object> {
    return this._httpClient.put(
      `${environment.apiUrl}/v1/AdminPanel/Assets/ValuesPutIsCurrent`,
      JSON.stringify({
        assetId: data.assetId,
        valueId: data.valueId,
      })
    );
  }
}
