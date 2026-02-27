import { inject, Injectable } from '@angular/core';
import { AssetsLocationRepository } from '../../assetsCrm.Application/repositories/assetsLocation.repository';
import { map, Observable } from 'rxjs';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { AssetLocation } from '../../assetsCrm.Domain/assetLocation';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  AssetLocationShortVm,
  LocationAssetVmMapper,
} from '../models/assetsLocations/AssetLocationShortVm';
import {
  LocationDto,
  LocationDtoMapper,
} from '../models/assetsLocations/assetLocationDto';
import {
  LocationVm,
  LocationVmMapper,
} from '../models/assetsLocations/assetLocationVm';

@Injectable()
export class AssetsLocationRepositoryImplementation
  implements AssetsLocationRepository
{
  private readonly _httpClient = inject(HttpClient);

  getPage(
    params: PaginationParams
  ): Observable<PaginationRespons<AssetLocation>> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/AssetsLocations/GetPage`, {
        params: {
          offset: params.offset ?? 0,
          pageIndex: params.pageIndex,
          search: params.search ?? '',
          ascending: params.ascending ?? true,
          sortBy: params.sortBy ?? '',
        },
      })
      .pipe(
        map((data) => {
          let respons: PaginationRespons<LocationDto> =
            data as PaginationRespons<LocationDto>;

          const items: AssetLocation[] = respons.items.map((c) =>
            LocationDtoMapper.Map().mapFrom(c)
          );

          return {
            pageInfo: respons.pageInfo,
            items: items,
          };
        })
      );
  }

  getList(): Observable<AssetLocation[]> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/AssetsLocations/GetList`)
      .pipe(
        map((data) => {
          let respons: LocationVm[] = data as LocationVm[];

          const items: AssetLocation[] = respons.map((c) =>
            LocationVmMapper.Map().mapFrom(c)
          );

          return items;
        })
      );
  }

  getLookUpList(): Observable<AssetLocation[]> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/AssetsLocations/GetLookUpList`)
      .pipe(
        map((data) => {
          const respons: AssetLocationShortVm[] =
            data as AssetLocationShortVm[];

          return respons.map((c) => LocationAssetVmMapper.Map().mapFrom(c));
        })
      );
  }

  get(id: string): Observable<AssetLocation> {
    throw new Error('Method not implemented.');
  }

  post(assetLocation: AssetLocation): Observable<string> {
    return this._httpClient
      .post(`${environment.apiUrl}/v1/AdminPanel/AssetsLocations`, {
        name: {
          ar: assetLocation.name?.ar,
          en: assetLocation.name?.en,
        },
      })
      .pipe(map((data) => data as string));
  }

  put(assetLocation: AssetLocation): Observable<object> {
    return this._httpClient.put(
      `${environment.apiUrl}/v1/AdminPanel/AssetsLocations`,
      {
        name: {
          ar: assetLocation.name?.ar,
          en: assetLocation.name?.en,
        },
        id: assetLocation.id,
      }
    );
  }

  delete(assetLocationId: string): Observable<object> {
    return this._httpClient.delete(
      `${environment.apiUrl}/v1/AdminPanel/AssetsLocations`,
      {
        params: {
          id: assetLocationId,
        },
      }
    );
  }
}
