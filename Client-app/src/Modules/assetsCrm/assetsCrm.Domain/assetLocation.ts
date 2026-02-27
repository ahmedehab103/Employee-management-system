import { LocalizedString } from '../../Common/domain/localized-string';
import { Asset } from './asset';

export interface AssetLocation {
  id?: string | null;
  name?: LocalizedString;
  translatedName?: string | null;
  assetsNumber?: number | null;
  assetsValue?: number | null;
  assets?: Asset[] | null;
  totalAssetRevenue?: number | null;
  completionPercentage?: number | null;
}
