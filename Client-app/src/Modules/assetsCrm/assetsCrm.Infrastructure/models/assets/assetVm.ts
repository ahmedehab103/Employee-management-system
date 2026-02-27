import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Asset } from '../../../assetsCrm.Domain/asset';
import { Comment } from '../../../assetsCrm.Domain/comment';
import { PointOnMap } from '../../../assetsCrm.Domain/pointOnMap';
import { Value } from '../../../assetsCrm.Domain/value';

export interface AssetVm {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  pointOnMap?: PointOnMap | null;
  location?: string | null;
  project?: string | null;
  images?: string[] | null;
  value?: Value | null;
  rentalValue?: Value | null;
}

export class AssetVmMapper extends Mapper<AssetVm, Asset> {
  override mapFrom(param: AssetVm): Asset {
    return {
      id: param.id,
      translatedName: param.name,
      translatedDescription: param.description,
      pointOnMap: param.pointOnMap,
      location: {
        translatedName: param.location,
      },
      project: {
        translatedName: param.project,
      },
      images: param.images,
      currentValue: param.value,
      rentalValue: param.rentalValue,
      comments: [],
    };
  }
  override mapTo(param: Asset): AssetVm {
    throw new Error('');
  }

  public static Map(): AssetVmMapper {
    return new AssetVmMapper();
  }
}

export interface CompanyGroup {
  id: string;
  name: string;
  projects: ProjectsGroup[];
}

export interface ProjectsGroup {
  id: string;
  name: string;
  assets: AssetShortVm[];
}

export interface AssetShortVm {
  id: string;
  pointOnMap: PointOnMap;
}
