import { Observable } from 'rxjs';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { Company } from '../../assetsCrm.Domain/company';
import { CompanyRepositoryImplementation } from '../../assetsCrm.Infrastructure/repositoryImplementation/company.repositoryImplementation';

export abstract class CompaniesRepository {
  abstract getPage(
    params: PaginationParams
  ): Observable<PaginationRespons<Company>>;

  abstract getList(): Observable<Company[]>;

  abstract getLookUpList(): Observable<Company[]>;

  abstract post(data: { company: Company; logo: File }): Observable<string>;

  abstract put(data: { company: Company; logo: File }): Observable<object>;

  abstract delete(Company: string): Observable<object>;
}

export const CompanyRepositoryProvider = {
  provide: CompaniesRepository,
  useClass: CompanyRepositoryImplementation,
};
