import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsRepository,
  ProjectsRepositoryProvider,
} from '../../repositories/project.repository';

@Injectable()
class ProjectsPostUseCase implements UseCase<Project, string> {
  private readonly _projectsRepository: ProjectsRepository =
    inject(ProjectsRepository);

  execute(project: Project): Observable<string> {
    return this._projectsRepository.post(project);
  }
}

const ProjectsPostProviders = [ProjectsRepositoryProvider, ProjectsPostUseCase];

export { ProjectsPostUseCase, ProjectsPostProviders };
