import { Observable } from 'rxjs';
import { AuthData, Role, User } from '../Identity.Domain/user';
import { UserImplementationRepository } from '../Identity.Infrastructure/repositories/user-implementation-repository';
import {
  PaginationParams,
  PaginationRespons,
} from '../../Common/domain/pagination';

export abstract class UserRepository {
  abstract login(params: {
    email: string;
    password: string;
    rememberMe: boolean;
  }): Observable<AuthData>;

  abstract getPage(data: {
    params: PaginationParams;
    role: Role;
  }): Observable<PaginationRespons<User>>;

  abstract get(): Observable<User>;

  abstract post(data: {
    user: User;
    password: string;
    confirmPassword: string;
  }): Observable<string>;

  abstract Put(data: {
    user: User;
    password: string;
    confirmPassword: string;
  }): Observable<object>;

  abstract putImage(data: { image: File; email: string }): Observable<string>;
}

export const userRepositoryProvider = {
  provide: UserRepository,
  useClass: UserImplementationRepository,
};
