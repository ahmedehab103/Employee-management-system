import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UseCase } from '../../../Common/application/use-case';
import { UserRepository, userRepositoryProvider } from '../user.repository';
import { AuthData, Role, User } from '../../Identity.Domain/user';
import { AuthService } from '../auth-service';
import { Company } from '../../../assetsCrm/assetsCrm.Domain/company';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';

@Injectable()
class UserLoginUseCase
  implements UseCase<{ email: string; password: string }, AuthData>
{
  private readonly userRepository = inject(UserRepository);
  private readonly _authService = inject(AuthService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: {
    email: string;
    password: string;
    rememberMe: boolean;
  }): Observable<AuthData> {
    return this.userRepository.login(params).pipe(
      map((data) => {
        this._authService.logIn(data);
        return data;
      })
    );
  }
}

const loginProviders = [userRepositoryProvider, UserLoginUseCase];
export { UserLoginUseCase, loginProviders };
