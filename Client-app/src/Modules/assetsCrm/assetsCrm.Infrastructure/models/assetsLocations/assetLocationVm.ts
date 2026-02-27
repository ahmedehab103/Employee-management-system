import { Mapper } from '../../../../Common/infrastructure/mapper';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';

export interface LocationVm {
  id: string;
  name: string;
  numberOfAsset: number | null;
  totalAssetValue: number | null;
  totalAssetRevenue: number | null;
  completionPercentage?: number | null;
}

export class LocationVmMapper extends Mapper<LocationVm, AssetLocation> {
  override mapFrom(param: LocationVm): AssetLocation {
    return {
      id: param.id,
      translatedName: param.name,
      assetsNumber: param.numberOfAsset,
      assetsValue: param.totalAssetValue,
      totalAssetRevenue: param.totalAssetRevenue,
      completionPercentage: param.completionPercentage,
    };
  }
  override mapTo(param: AssetLocation): LocationVm {
    throw new Error('Method not implemented.');
  }
  public static Map(): LocationVmMapper {
    return new LocationVmMapper();
  }
}
