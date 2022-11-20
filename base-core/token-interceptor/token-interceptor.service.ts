import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null!);

  constructor(
    private authService: AuthService
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAccessTokenExist()) {
      req = this.addToken(req, this.authService.getAccessToken());
    }

    return next.handle(req)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          } else {
            return throwError(error);
          }
        })
      );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone(
      {
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null!);

      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => {
          if (token) {
            return true;
          } else {
            this.authService.unauthorizedLogOut();

            return false;
          }
        }),
        take(1),
        switchMap(jwt => next.handle(this.addToken(request, jwt)))
      );
    }
  }
}
