import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import { Company } from '../../../assetsCrm.Domain/company';
import {
  CompaniesRepository,
  CompanyRepositoryProvider,
} from '../../repositories/company.repository';

@Injectable()
class CompaniesPostUseCase
  implements UseCase<{ company: Company; logo: File }, string>
{
  private readonly _CompaniesRepository: CompaniesRepository =
    inject(CompaniesRepository);

  execute(data: { company: Company; logo: File }): Observable<string> {
    return this._CompaniesRepository.post(data);
  }
}

const CompaniesPostProviders = [
  CompanyRepositoryProvider,
  CompaniesPostUseCase,
];

export { CompaniesPostUseCase, CompaniesPostProviders };
