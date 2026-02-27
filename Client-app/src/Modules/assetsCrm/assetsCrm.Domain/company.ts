import { LocalizedString } from '../../Common/domain/localized-string';
import { Project } from './project';

export interface Company {
  id?: string | null;
  name?: LocalizedString | null;
  translatedName?: string | null;
  logo?: string | null;
  assetsNumber?: number | null;
  assetsValue?: number | null;
  projects?: Project[] | null;
  totalAssetRevenue?: number | null;
}
