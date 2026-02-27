import { inject, Injectable } from '@angular/core';
import { CompaniesRepository } from '../../assetsCrm.Application/repositories/company.repository';
import { map, Observable } from 'rxjs';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { Company } from '../../assetsCrm.Domain/company';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  CompanyShortVm,
  CompanyShortVmMapper,
} from '../models/companies/companyShortVm';
import { CompanyDto, CompanyDtoMapper } from '../models/companies/companyDto';
import { CompanyVm, CompanyVmMapper } from '../models/companies/companyVm';

@Injectable()
export class CompanyRepositoryImplementation implements CompaniesRepository {
  private readonly _httpClient = inject(HttpClient);

  getPage(params: PaginationParams): Observable<PaginationRespons<Company>> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Companies/GetPage`, {
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
          let respons: PaginationRespons<CompanyDto> =
            data as PaginationRespons<CompanyDto>;

          const items: Company[] = respons.items.map((c) =>
            CompanyDtoMapper.Map().mapFrom(c)
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
      .get(`${environment.apiUrl}/v1/AdminPanel/Companies/GetList`)
      .pipe(
        map((data) => {
          let respons: CompanyVm[] = data as CompanyVm[];

          const items: Company[] = respons.map((c) =>
            CompanyVmMapper.Map().mapFrom(c)
          );

          return items;
        })
      );
  }
  getLookUpList(): Observable<Company[]> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Companies/GetLookUpList`)
      .pipe(
        map((data) => {
          const respons: CompanyShortVm[] = data as CompanyShortVm[];

          return respons.map((c) => CompanyShortVmMapper.Map().mapFrom(c));
        })
      );
  }
  post(data: { company: Company; logo: File }): Observable<string> {
    const content_ = new FormData();

    if (data.logo) content_.append('Logo', data.logo, data.logo.name);

    return this._httpClient
      .post(`${environment.apiUrl}/v1/AdminPanel/Companies`, content_, {
        headers: new HttpHeaders({ 'Skip-Content-Type': '1' }),
        params: {
          'Name.Ar': data.company.name?.ar ?? '',
          'Name.En': data.company.name?.en ?? '',
        },
      })
      .pipe(map((data) => data as string));
  }

  put(data: { company: Company; logo: File }): Observable<object> {
    const content_ = new FormData();

    if (data.logo) content_.append('Logo', data.logo, data.logo.name);

    return this._httpClient.put(
      `${environment.apiUrl}/v1/AdminPanel/Companies`,
      content_,
      {
        headers: new HttpHeaders({ 'Skip-Content-Type': '1' }),
        params: {
          Id: data.company.id ?? '',
          'Name.Ar': data.company.name?.ar ?? '',
          'Name.En': data.company.name?.en ?? '',
        },
      }
    );
  }

  delete(companyId: string): Observable<object> {
    return this._httpClient.delete(
      `${environment.apiUrl}/v1/AdminPanel/Companies?`,
      {
        params: {
          id: companyId,
        },
      }
    );
  }
}
