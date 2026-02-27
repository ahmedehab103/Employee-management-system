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
class UserGetUseCase implements UseCase<void, User> {
  private readonly userRepository = inject(UserRepository);

  execute(): Observable<User> {
    return this.userRepository.get();
  }
}

const UserGetProviders = [userRepositoryProvider, UserGetUseCase];
export { UserGetUseCase, UserGetProviders };
