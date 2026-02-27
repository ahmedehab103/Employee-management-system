import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsRepositoryProvider,
  ProjectsRepository,
} from '../../repositories/project.repository';

@Injectable()
class ProjectsGetLookUpUseCase implements UseCaseWithOutInPut<Project[]> {
  private readonly _projectsRepository: ProjectsRepository =
    inject(ProjectsRepository);

  constructor() {}

  execute(): Observable<Project[]> {
    return this._projectsRepository.getLookUpList();
  }
}

const ProjectsGetLookUpProviders = [
  ProjectsRepositoryProvider,
  ProjectsGetLookUpUseCase,
];
export { ProjectsGetLookUpUseCase, ProjectsGetLookUpProviders };
