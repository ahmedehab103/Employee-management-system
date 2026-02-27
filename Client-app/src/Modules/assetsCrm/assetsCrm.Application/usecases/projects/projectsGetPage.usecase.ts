import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../../Common/domain/pagination';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsRepository,
  ProjectsRepositoryProvider,
} from '../../repositories/project.repository';

@Injectable()
class ProjectsGetPageUseCase
  implements
    UseCase<
      { params: PaginationParams; CompaniesIds: string[] },
      PaginationRespons<Project>
    >
{
  private readonly _projectsRepository: ProjectsRepository =
    inject(ProjectsRepository);

  execute(obj: {
    params: PaginationParams;
    CompaniesIds: string[];
  }): Observable<PaginationRespons<Project>> {
    return this._projectsRepository.getPage(obj.params, obj.CompaniesIds);
  }
}

const ProjectsGetPageProviders = [
  ProjectsRepositoryProvider,
  ProjectsGetPageUseCase,
];

export { ProjectsGetPageUseCase, ProjectsGetPageProviders };
