import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {
  constructor() {}

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log('📢[api-handler.service.ts:13]: error: ', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server-side error with a message in the response body
      errorMessage = error.error.message;
    } else if (error.status) {
      // Fallback to status text if no message is available
      errorMessage = `Server returned code ${error.status}: ${error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
