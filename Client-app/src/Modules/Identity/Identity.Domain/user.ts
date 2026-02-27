import { LocalizedString } from '../../Common/domain/localized-string';

export interface User {
  id?: string;
  fullName?: FullName;
  username?: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: Date;
  profilePicture?: string;
  activationStatus?: boolean;
  role?: Role;
  companies?: UserCompany[];
}

export interface FullName {
  firstName: string;
  lastName: string;
}

export enum Role {
  Admin,
  User,
}

export interface UserCompany {
  id: string;
  localizedString?: LocalizedString;
}

export class AuthData {
  token?: string;
  refreshToken?: string;
}
