import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../../Common/domain/pagination';
import { Company } from '../../../assetsCrm.Domain/company';
import {
  CompaniesRepository,
  CompanyRepositoryProvider,
} from '../../repositories/company.repository';

@Injectable()
class CompaniesGetPageUseCase
  implements UseCase<PaginationParams, PaginationRespons<Company>>
{
  private readonly _CompaniesRepository: CompaniesRepository =
    inject(CompaniesRepository);

  execute(params: PaginationParams): Observable<PaginationRespons<Company>> {
    return this._CompaniesRepository.getPage(params);
  }
}

const CompaniesGetPageProviders = [
  CompanyRepositoryProvider,
  CompaniesGetPageUseCase,
];

export { CompaniesGetPageUseCase, CompaniesGetPageProviders };
