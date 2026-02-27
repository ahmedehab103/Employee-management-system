import { Mapper } from '../../../../Common/infrastructure/mapper';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';
import { Project } from '../../../assetsCrm.Domain/project';
import { CompanyShortVm } from '../companies/companyShortVm';

export interface AssetLocationShortVm {
  id: string;
  name: string;
}

export class LocationAssetVmMapper extends Mapper<CompanyShortVm, Project> {
  override mapFrom(param: AssetLocationShortVm): AssetLocation {
    return {
      id: param.id,
      translatedName: param.name,
    };
  }
  override mapTo(param: AssetLocation): AssetLocationShortVm {
    throw new Error('Method not implemented.');
  }
  public static Map(): LocationAssetVmMapper {
    return new LocationAssetVmMapper();
  }
}
