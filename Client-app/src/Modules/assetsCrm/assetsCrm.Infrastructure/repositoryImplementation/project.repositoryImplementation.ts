import { inject, Injectable } from '@angular/core';
import { ProjectsRepository } from '../../assetsCrm.Application/repositories/project.repository';
import { map, Observable } from 'rxjs';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { Project } from '../../assetsCrm.Domain/project';
import { environment } from '../../../../environments/environment';
import {
  ProjectShortVm,
  ProjectShortVmMapper,
} from '../models/projects/ProjectShortVm';
import { HttpClient } from '@angular/common/http';
import { ProjectDto, ProjectDtoMapper } from '../models/projects/projectDto';
import { ProjectVm, ProjectVmMapper } from '../models/projects/projectVm';

@Injectable()
export class ProjectRepositoryImplementation implements ProjectsRepository {
  private readonly _httpClient = inject(HttpClient);

  getPage(
    params: PaginationParams,
    CompaniesIds: string[]
  ): Observable<PaginationRespons<Project>> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/AssetsProjects/GetPage`, {
        params: {
          CompaniesIds: CompaniesIds,
          offset: params.offset ?? 0,
          pageIndex: params.pageIndex,
          search: params.search ?? '',
          ascending: params.ascending ?? true,
          sortBy: params.sortBy ?? '',
        },
      })
      .pipe(
        map((data) => {
          let respons: PaginationRespons<ProjectDto> =
            data as PaginationRespons<ProjectDto>;

          const items: Project[] = respons.items.map((c) =>
            ProjectDtoMapper.Map().mapFrom(c)
          );

          return {
            pageInfo: respons.pageInfo,
            items: items,
          };
        })
      );
  }

  getList(): Observable<Project[]> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/AssetsProjects/GetList`)
      .pipe(
        map((data) => {
          let respons: ProjectVm[] = data as ProjectVm[];

          const items: Project[] = respons.map((c) =>
            ProjectVmMapper.Map().mapFrom(c)
          );

          return items;
        })
      );
  }

  getLookUpList(): Observable<Project[]> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/AssetsProjects/GetLookUpList`)
      .pipe(
        map((data) => {
          const respons: ProjectShortVm[] = data as ProjectShortVm[];

          return respons.map((c) => ProjectShortVmMapper.Map().mapFrom(c));
        })
      );
  }

  post(project: Project): Observable<string> {
    return this._httpClient
      .post(`${environment.apiUrl}/v1/AdminPanel/AssetsProjects`, {
        name: {
          ar: project.name?.ar,
          en: project.name?.en,
        },
        companyId: project.company?.id,
      })
      .pipe(map((data) => data as string));
  }

  put(project: Project): Observable<object> {
    return this._httpClient.put(
      `${environment.apiUrl}/v1/AdminPanel/AssetsProjects`,
      {
        name: {
          ar: project.name?.ar,
          en: project.name?.en,
        },
        id: project.id,
      }
    );
  }

  delete(projectId: string): Observable<object> {
    return this._httpClient.delete(
      `${environment.apiUrl}/v1/AdminPanel/AssetsProjects`,
      {
        params: {
          id: projectId,
        },
      }
    );
  }
}
