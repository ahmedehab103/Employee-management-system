import { LocalizedString } from '../../../../Common/domain/localized-string';
import { Mapper } from '../../../../Common/infrastructure/mapper';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';

export interface LocationDto {
  id: string;
  name: LocalizedString;
  numberOfAsset: number | null;
  totalAssetValue: number | null;
  totalAssetRevenue: number | null;
  completionPercentage?: number | null;
}

export class LocationDtoMapper extends Mapper<LocationDto, AssetLocation> {
  override mapFrom(param: LocationDto): AssetLocation {
    return {
      id: param.id,
      name: param.name,
      assetsNumber: param.numberOfAsset,
      assetsValue: param.totalAssetValue,
      totalAssetRevenue: param.totalAssetRevenue,
      completionPercentage: param.completionPercentage,
    };
  }
  override mapTo(param: AssetLocation): LocationDto {
    throw new Error('Method not implemented.');
  }
  public static Map(): LocationDtoMapper {
    return new LocationDtoMapper();
  }
}
