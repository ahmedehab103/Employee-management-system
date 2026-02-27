import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../Common/application/use-case';
import { AuthService } from '../auth-service';
@Injectable()
export class UserLogOutUseCase implements UseCaseWithOutInPut<boolean> {
  private readonly _auth = inject(AuthService);

  execute(): Observable<boolean> {
    this._auth.logOut();

    return of(true);
  }
}
