import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Company } from '../../../assetsCrm.Domain/company';

export interface CompanyShortVm {
  id: string;
  name: string;
}

export class CompanyShortVmMapper extends Mapper<CompanyShortVm, Company> {
  override mapFrom(param: CompanyShortVm): Company {
    return {
      id: param.id,
      translatedName: param.name,
    };
  }
  override mapTo(param: Company): CompanyShortVm {
    throw new Error('Method not implemented.');
  }
  public static Map(): CompanyShortVmMapper {
    return new CompanyShortVmMapper();
  }
}
