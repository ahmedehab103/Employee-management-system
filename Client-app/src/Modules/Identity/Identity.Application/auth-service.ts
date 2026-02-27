import { Injectable } from '@angular/core';
import { AuthData } from '../Identity.Domain/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authDataKey = 'authToken';

  logIn(data: AuthData): void {
    //TODo use increption
    localStorage.setItem(this.authDataKey, JSON.stringify(data));
  }

  getAuthData(): AuthData | null {
    const data: any = localStorage.getItem(this.authDataKey);
    var dataObject: AuthData = JSON.parse(data);

    return dataObject;
  }

  logOut(): void {
    localStorage.removeItem(this.authDataKey);
  }

  isEditor(): boolean {
    return this.getDecodedAccessToken().roles == 'Admin';
  }

  private getDecodedAccessToken(): any {
    const jwtHelper: JwtHelperService = new JwtHelperService();
    const token = jwtHelper.decodeToken(this.getAuthData()?.token + '');

    return token;
  }
}
