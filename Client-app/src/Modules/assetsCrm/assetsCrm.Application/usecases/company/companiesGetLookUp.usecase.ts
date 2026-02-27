import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../../Common/application/use-case';
import {
  CompaniesRepository,
  CompanyRepositoryProvider,
} from '../../repositories/company.repository';
import { Company } from '../../../assetsCrm.Domain/company';

@Injectable()
class CompaniesGetLookUpUseCase implements UseCaseWithOutInPut<Company[]> {
  private readonly _companiesRepository: CompaniesRepository =
    inject(CompaniesRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(): Observable<Company[]> {
    return this._companiesRepository.getLookUpList();
  }
}

const CompaniesGetLookUpProviders = [
  CompanyRepositoryProvider,
  CompaniesGetLookUpUseCase,
];
export { CompaniesGetLookUpUseCase, CompaniesGetLookUpProviders };
