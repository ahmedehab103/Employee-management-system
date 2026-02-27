import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Project } from '../../../assetsCrm.Domain/project';

export interface ProjectVm {
  id: string;
  name: string;
  companyName: string | null;
  numberOfAsset: number | null;
  totalAssetValue: number | null;
  completionPercentage: number | null;
  totalAssetRevenue: number | null;
}

export class ProjectVmMapper extends Mapper<ProjectVm, Project> {
  override mapFrom(param: ProjectVm): Project {
    return {
      id: param.id,
      translatedName: param.name,
      company: {
        translatedName: param.companyName,
      },
      assetsNumber: param.numberOfAsset,
      assetsValue: param.totalAssetValue,
      completionPercentage: Math.trunc(param.completionPercentage as number),
      totalAssetRevenue: param.totalAssetRevenue,
    };
  }
  override mapTo(param: Project): ProjectVm {
    throw new Error('Method not implemented.');
  }
  public static Map(): ProjectVmMapper {
    return new ProjectVmMapper();
  }
}
