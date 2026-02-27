import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import { Company } from '../../../assetsCrm.Domain/company';
import {
  CompaniesRepository,
  CompanyRepositoryProvider,
} from '../../repositories/company.repository';

@Injectable()
class CompaniesListUseCase implements UseCaseWithOutInPut<Company[]> {
  private readonly _companiesRepository: CompaniesRepository =
    inject(CompaniesRepository);

  execute(): Observable<Company[]> {
    return this._companiesRepository.getList();
  }
}

const CompaniesGetListProviders = [
  CompanyRepositoryProvider,
  CompaniesListUseCase,
];

export { CompaniesListUseCase, CompaniesGetListProviders };
