import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UseCase,
  UseCaseWithOutOutPut,
} from '../../../Common/application/use-case';
import { User } from '../../Identity.Domain/user';
import { UserRepository, userRepositoryProvider } from '../user.repository';

@Injectable()
class UserPostUseCase
  implements
    UseCase<
      {
        user: User;
        password: string;
        confirmPassword: string;
      },
      string
    >
{
  private readonly userRepository = inject(UserRepository);

  execute(data: {
    user: User;
    password: string;
    confirmPassword: string;
  }): Observable<string> {
    return this.userRepository.post(data);
  }
}

const UserPostProviders = [userRepositoryProvider, UserPostUseCase];
export { UserPostUseCase, UserPostProviders };
