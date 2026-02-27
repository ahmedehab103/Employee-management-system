import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../Common/application/use-case';
import { UserRepository, userRepositoryProvider } from '../user.repository';

@Injectable()
class UserPutImageUseCase
  implements UseCase<{ image: File; email: string }, string>
{
  private readonly userRepository: UserRepository = inject(UserRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(data: { image: File; email: string }): Observable<string> {
    return this.userRepository.putImage(data);
  }
}

const UserPutImageProviders = [userRepositoryProvider, UserPutImageUseCase];
export { UserPutImageUseCase, UserPutImageProviders };
