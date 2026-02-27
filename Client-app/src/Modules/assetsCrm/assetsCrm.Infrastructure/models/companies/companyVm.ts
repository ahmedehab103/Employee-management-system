import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Company } from '../../../assetsCrm.Domain/company';

export interface CompanyVm {
  id: string;
  name: string;
  numberOfAsset: number | null;
  totalAssetValue: number | null;
  totalAssetRevenue: number | null;
}

export class CompanyVmMapper extends Mapper<CompanyVm, Company> {
  override mapFrom(param: CompanyVm): Company {
    return {
      id: param.id,
      translatedName: param.name,
      assetsNumber: param.numberOfAsset,
      assetsValue: param.totalAssetValue,
      totalAssetRevenue: param.totalAssetValue,
    };
  }
  override mapTo(param: Company): CompanyVm {
    throw new Error('Method not implemented.');
  }
  public static Map(): CompanyVmMapper {
    return new CompanyVmMapper();
  }
}
