import { map } from 'rxjs';
import { UserCompany } from './../../Identity.Domain/user';
import { Mapper } from '../../../Common/infrastructure/mapper';
import { FullName, User } from '../../Identity.Domain/user';

export interface UserDto {
  id?: string;
  fullName?: FullName;
  pictureUrl?: string;
  phoneNumber?: string;
  email?: string;
  status?: number;
  createdAt?: Date;
  companies?: string[];
}

export class UserMapper extends Mapper<UserDto, User> {
  mapFrom(param: UserDto): User {
    return {
      id: param.id,
      fullName: param.fullName,
      profilePicture: param.pictureUrl,
      phoneNumber: param.phoneNumber,
      email: param.email,
      companies: param.companies?.map((c) => {
        return { id: c };
      }),
    };
  }

  mapTo(param: User): UserDto {
    return {};
  }

  public static Map(): UserMapper {
    return new UserMapper();
  }
}
