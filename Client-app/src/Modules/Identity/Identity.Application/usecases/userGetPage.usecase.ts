import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../Common/application/use-case';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { Role, User } from '../../Identity.Domain/user';
import { UserRepository, userRepositoryProvider } from '../user.repository';

@Injectable()
class UserGetPageUseCase
  implements
    UseCase<{ params: PaginationParams; role: Role }, PaginationRespons<User>>
{
  private readonly userRepository = inject(UserRepository);

  execute(data: {
    params: PaginationParams;
    role: Role;
  }): Observable<PaginationRespons<User>> {
    return this.userRepository.getPage(data);
  }
}

const UserGetPageProviders = [userRepositoryProvider, UserGetPageUseCase];
export { UserGetPageUseCase, UserGetPageProviders };
