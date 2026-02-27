import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../../Common/application/use-case';
import { Company } from '../../../assetsCrm.Domain/company';
import {
  CompaniesRepository,
  CompanyRepositoryProvider,
} from '../../repositories/company.repository';

@Injectable()
class CompaniesPutUseCase
  implements UseCaseWithOutOutPut<{ company: Company; logo: File }>
{
  private readonly _CompaniesRepository: CompaniesRepository =
    inject(CompaniesRepository);

  execute(data: { company: Company; logo: File }): Observable<object> {
    return this._CompaniesRepository.put(data);
  }
}

const CompaniesPutProviders = [CompanyRepositoryProvider, CompaniesPutUseCase];
export { CompaniesPutUseCase, CompaniesPutProviders };
