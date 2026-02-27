import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserRepository } from '../../Identity.Application/user.repository';
import { AuthData, User, Role } from '../../Identity.Domain/user';
import { environment } from '../../../../environments/environment';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { UserDto, UserMapper } from '../models/userModel';
@Injectable()
export class UserImplementationRepository implements UserRepository {
  private readonly _httpClient = inject(HttpClient);

  getPage(data: {
    params: PaginationParams;
    role: Role;
  }): Observable<PaginationRespons<User>> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Identity/GetPage`, {
        params: {
          offset: data.params.offset ?? 0,
          pageIndex: data.params.pageIndex,
          search: data.params.search ?? '',
          ascending: data.params.ascending ?? true,
          sortBy: data.params.sortBy ?? '',
          Role: data.role,
        },
      })
      .pipe(
        map((data) => {
          let respons: PaginationRespons<UserDto> =
            data as PaginationRespons<UserDto>;

          const items: User[] = respons.items.map((c) =>
            UserMapper.Map().mapFrom(c)
          );

          return {
            pageInfo: respons.pageInfo,
            items: items,
          };
        })
      );
  }

  get(): Observable<User> {
    return this._httpClient
      .get(`${environment.apiUrl}/v1/AdminPanel/Identity`)
      .pipe(
        map((data) => {
          return data as User;
        })
      );
  }
  post(data: {
    user: User;
    password: string;
    confirmPassword: string;
  }): Observable<string> {
    return this._httpClient
      .post(`${environment.apiUrl}/v1/AdminPanel/Identity/PostUser`, {
        phoneNumber: data.user.phoneNumber,
        fullName: data.user.fullName,
        email: data.user.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.user.role,
        companiesIds: data.user.companies?.map((c) => c.id),
      })
      .pipe(map((data) => data as string));
  }

  Put(data: {
    user: User;
    password: string;
    confirmPassword: string;
  }): Observable<object> {
    return this._httpClient.put(
      `${environment.apiUrl}/v1/AdminPanel/Identity/PutUser`,
      {
        phoneNumber: data.user.phoneNumber,
        fullName: data.user.fullName,
        email: data.user.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        companiesIds: data.user.companies?.map((c) => c.id),
      }
    );
  }

  putImage(data: { image: File; email: string }): Observable<string> {
    const content_ = new FormData();

    content_.append('Photo', data.image, data.image.name);

    content_.append('Email', data.email);

    return this._httpClient
      .put(
        `${environment.apiUrl}/v1/AdminPanel/Identity/PutUserPhoto`,
        content_,
        {
          headers: new HttpHeaders({ 'Skip-Content-Type': '1' }),
        }
      )
      .pipe(map((data) => data as string));
  }

  login(params: {
    email: string;
    password: string;
    rememberMe: boolean;
  }): Observable<AuthData> {
    return this._httpClient
      .put(
        `${environment.apiUrl}/v1/AdminPanel/Identity/LogIn`,
        JSON.stringify({
          email: params.email,
          password: params.password,
        })
      )
      .pipe(map((data) => data as AuthData));
  }
}
