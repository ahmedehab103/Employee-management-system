import { LocalizedString } from '../../../../Common/domain/localized-string';
import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Company } from '../../../assetsCrm.Domain/company';

export interface CompanyDto {
  id: string;
  name: LocalizedString;
  logo: string | null;
  numberOfAsset: number | null;
  totalAssetValue: number | null;
  totalAssetRevenue: number | null;
}

export class CompanyDtoMapper extends Mapper<CompanyDto, Company> {
  override mapFrom(param: CompanyDto): Company {
    return {
      id: param.id,
      name: param.name,
      logo: param.logo,
      assetsNumber: param.numberOfAsset,
      assetsValue: param.totalAssetValue,
      totalAssetRevenue: param.totalAssetRevenue,
    };
  }
  override mapTo(param: Company): CompanyDto {
    throw new Error('Method not implemented.');
  }
  public static Map(): CompanyDtoMapper {
    return new CompanyDtoMapper();
  }
}
