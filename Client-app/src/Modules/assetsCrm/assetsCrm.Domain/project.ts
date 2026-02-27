import { LocalizedString } from '../../Common/domain/localized-string';
import { Asset } from './asset';
import { Company } from './company';

export interface Project {
  id?: string | null;
  name?: LocalizedString | null;
  translatedName?: string | null;
  assetsNumber?: number | null;
  assetsValue?: number | null;
  company?: Company | null;
  assets?: Asset[] | null;
  completionPercentage?: number | null;
  totalAssetRevenue?: number | null;
}
