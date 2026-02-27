import { Mapper } from '../../../../Common/infrastructure/mapper';
import { Project } from '../../../assetsCrm.Domain/project';

export interface ProjectShortVm {
  id: string;
  name: string;
  companyId: string;
}

export class ProjectShortVmMapper extends Mapper<ProjectShortVm, Project> {
  override mapFrom(param: ProjectShortVm): Project {
    return {
      id: param.id,
      translatedName: param.name,
      company: {
        id: param.companyId,
      },
    };
  }
  override mapTo(param: Project): ProjectShortVm {
    throw new Error('Method not implemented.');
  }
  public static Map(): ProjectShortVmMapper {
    return new ProjectShortVmMapper();
  }
}
