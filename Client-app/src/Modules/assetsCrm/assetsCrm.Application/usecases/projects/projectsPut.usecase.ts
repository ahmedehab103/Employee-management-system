import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsRepository,
  ProjectsRepositoryProvider,
} from '../../repositories/project.repository';

@Injectable()
class ProjectsPutUseCase implements UseCaseWithOutOutPut<Project> {
  private readonly _projectsRepository: ProjectsRepository =
    inject(ProjectsRepository);

  execute(project: Project): Observable<object> {
    return this._projectsRepository.put(project);
  }
}

const ProjectsPutProviders = [ProjectsRepositoryProvider, ProjectsPutUseCase];
export { ProjectsPutUseCase, ProjectsPutProviders };
