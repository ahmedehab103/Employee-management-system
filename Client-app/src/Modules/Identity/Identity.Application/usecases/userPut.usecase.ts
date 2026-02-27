import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../Common/application/use-case';
import { User } from '../../Identity.Domain/user';
import { UserRepository, userRepositoryProvider } from '../user.repository';

@Injectable()
class UserPutUseCase
  implements
    UseCaseWithOutOutPut<{
      user: User;
      password: string;
      confirmPassword: string;
    }>
{
  private readonly userRepository = inject(UserRepository);

  execute(data: {
    user: User;
    password: string;
    confirmPassword: string;
  }): Observable<object> {
    return this.userRepository.Put(data);
  }
}

const UserPutProviders = [userRepositoryProvider, UserPutUseCase];
export { UserPutUseCase, UserPutProviders };
