import { Observable } from 'rxjs';
import { Project } from '../../assetsCrm.Domain/project';
import { ProjectRepositoryImplementation } from '../../assetsCrm.Infrastructure/repositoryImplementation/project.repositoryImplementation';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';

export abstract class ProjectsRepository {
  abstract getPage(
    params: PaginationParams,
    CompaniesIds: string[]
  ): Observable<PaginationRespons<Project>>;

  abstract getList(): Observable<Project[]>;

  abstract getLookUpList(): Observable<Project[]>;

  abstract post(Project: Project): Observable<string>;

  abstract put(Project: Project): Observable<object>;

  abstract delete(Project: string): Observable<object>;
}

export const ProjectsRepositoryProvider = {
  provide: ProjectsRepository,
  useClass: ProjectRepositoryImplementation,
};
