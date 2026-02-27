import { LocalizedString } from '../../Common/domain/localized-string';

import { AssetLocation } from './assetLocation';
import { PointOnMap } from './pointOnMap';
import { Project } from './project';
import { Value } from './value';
import { Comment } from './comment';

export interface Asset {
  id?: string | null;
  name?: LocalizedString | null;
  translatedName?: string | null;
  description?: LocalizedString | null;
  translatedDescription?: string | null;
  pointOnMap?: PointOnMap | null;
  location?: AssetLocation | null;
  project?: Project | null;
  images?: string[] | null;
  currentValue?: Value | null;
  values?: Value[] | null;
  rentalValue?: Value | null;
  comments?: Comment[] | null;
}
