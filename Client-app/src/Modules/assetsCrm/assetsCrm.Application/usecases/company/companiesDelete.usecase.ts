import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import {
  CompaniesRepository,
  CompanyRepositoryProvider,
} from '../../repositories/company.repository';

@Injectable()
class CompaniesDeleteUseCase implements UseCaseWithOutOutPut<string> {
  private readonly _CompaniesRepository: CompaniesRepository =
    inject(CompaniesRepository);

  execute(companyId: string): Observable<object> {
    return this._CompaniesRepository.delete(companyId);
  }
}

const CompaniesDeleteProviders = [
  CompanyRepositoryProvider,
  CompaniesDeleteUseCase,
];
export { CompaniesDeleteUseCase, CompaniesDeleteProviders };
