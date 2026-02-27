import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../Modules/Identity/Identity.Application/auth-service';
import { AuthData } from '../../Modules/Identity/Identity.Domain/user';
import { LocalizationService } from '../../Modules/Common/domain/servies/localization-service';
export const APP_VERSION = new InjectionToken<string>('APP_VERSION');

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}

@Injectable()
export class HttpClintInterceptor implements HttpInterceptor {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _auth = inject(AuthService);
  private readonly _localizationService: LocalizationService =
    inject(LocalizationService);

  /** Inserted by Angular inject() migration for backwards compatibility */

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers: any = {
      Accept: 'application/json',
    };

    let contentType = req.headers.get('Skip-Content-Type');

    if (!contentType) headers['Content-Type'] = 'application/json';

    const lang = this._localizationService.getCurrentLang();

    headers['Accept-Language'] = lang?.getString();

    const authData: AuthData | null = this._auth.getAuthData();

    if (authData) headers.Authorization = `Bearer ${authData.token}`;

    const modifiedRequest = req.clone({
      setHeaders: headers,
    });

    return next
      .handle(modifiedRequest)
      .pipe(catchError((err) => this.handleErrorReq(err, authData)));
  }
  private handleErrorReq(
    err: HttpErrorResponse,
    authData: AuthData | null
  ): Observable<never> {
    switch (err.status) {
      case 401:
        if (authData?.refreshToken) {
          // TODo refreshToken here
        }
        {
          const returnUrl = this._route.snapshot.url.reduce(
            (path, currentSegment) => `${path}/${currentSegment.path}`,
            ''
          );
          this._auth.logOut();
          this._router.navigate(['/login'], { queryParams: { returnUrl } });
        }
        break;
      case 404:
        this._router.navigateByUrl('/404');
        break;

      case 403:
        this._router.navigateByUrl('/403');
        break;

      case 500:
        this._router.navigateByUrl('/500');
        break;
    }

    return throwError(err);
  }
}
