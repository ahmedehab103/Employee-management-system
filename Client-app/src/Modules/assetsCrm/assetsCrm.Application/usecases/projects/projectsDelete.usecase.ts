import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import {
  ProjectsRepository,
  ProjectsRepositoryProvider,
} from '../../repositories/project.repository';

@Injectable()
class ProjectsDeleteUseCase implements UseCaseWithOutOutPut<string> {
  private readonly _projectsRepository: ProjectsRepository =
    inject(ProjectsRepository);

  execute(projectId: string): Observable<object> {
    return this._projectsRepository.delete(projectId);
  }
}

const projectsDeleteProviders = [
  ProjectsRepositoryProvider,
  ProjectsDeleteUseCase,
];
export { ProjectsDeleteUseCase, projectsDeleteProviders };
