import { LocalizedString } from '../../../../Common/domain/localized-string';
import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Asset } from '../../../assetsCrm.Domain/asset';
import { PointOnMap } from '../../../assetsCrm.Domain/pointOnMap';
import { Value } from '../../../assetsCrm.Domain/value';
import { Comment } from '../../../assetsCrm.Domain/comment';

export interface AssetDto {
  id?: string | null;
  name?: LocalizedString | null;
  description?: LocalizedString | null;
  pointOnMap?: PointOnMap | null;
  location?: string | null;
  locationId?: string | null;
  project?: string | null;
  projectId?: string | null;
  images?: string[] | null;
  value?: Value | null;
  values?: Value[] | null;
  rentalValue?: Value | null;
  comments?: Comment[] | null;
}

export class AssetDtoMapper extends Mapper<AssetDto, Asset> {
  override mapFrom(param: AssetDto): Asset {
    return {
      id: param.id,
      name: param.name,
      description: param.description,
      pointOnMap: param.pointOnMap,
      location: {
        id: param.locationId,
        translatedName: param.location,
      },
      project: {
        id: param.projectId,
        translatedName: param.project,
      },
      images: param.images,
      currentValue: param.value,
      values: param.values,
      rentalValue: param.rentalValue,
      comments: param.comments,
    };
  }
  override mapTo(param: Asset): AssetDto {
    return {
      id: param.id,
      name: param.name,
      description: param.description,
      pointOnMap: param.pointOnMap,
      locationId: param.location?.id,
      projectId: param.project?.id,
      images: param.images,
      comments: param.comments,
    };
  }

  public static Map(): AssetDtoMapper {
    return new AssetDtoMapper();
  }
}
