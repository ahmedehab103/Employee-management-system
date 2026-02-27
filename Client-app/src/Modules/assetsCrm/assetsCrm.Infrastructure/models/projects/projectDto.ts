import { LocalizedString } from '../../../../Common/domain/localized-string';
import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Project } from '../../../assetsCrm.Domain/project';

export interface ProjectDto {
  id: string;
  companyId: string;
  name: LocalizedString;
  companyName: string | null;
  numberOfAsset: number | null;
  totalAssetValue: number | null;
  completionPercentage: number | null;
  totalAssetRevenue: number | null;
}

export class ProjectDtoMapper extends Mapper<ProjectDto, Project> {
  override mapFrom(param: ProjectDto): Project {
    return {
      id: param.id,
      name: param.name,
      company: {
        translatedName: param.companyName,
        id: param.companyId,
      },
      assetsNumber: param.numberOfAsset,
      assetsValue: param.totalAssetValue,
      completionPercentage: param.completionPercentage,
      totalAssetRevenue: param.totalAssetRevenue,
    };
  }
  override mapTo(param: Project): ProjectDto {
    throw new Error('Method not implemented.');
  }
  public static Map(): ProjectDtoMapper {
    return new ProjectDtoMapper();
  }
}
