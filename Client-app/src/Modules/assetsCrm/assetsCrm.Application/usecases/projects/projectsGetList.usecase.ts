import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsRepository,
  ProjectsRepositoryProvider,
} from '../../repositories/project.repository';

@Injectable()
class ProjectsListUseCase implements UseCaseWithOutInPut<Project[]> {
  private readonly _projectsRepository: ProjectsRepository =
    inject(ProjectsRepository);

  execute(): Observable<Project[]> {
    return this._projectsRepository.getList();
  }
}

const ProjectsGetListProviders = [
  ProjectsRepositoryProvider,
  ProjectsListUseCase,
];

export { ProjectsListUseCase, ProjectsGetListProviders };
