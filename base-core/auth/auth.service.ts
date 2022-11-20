import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { BaseUserModel, UserModel } from '@models';

import { BaseApiUrls } from '../base-api-urls';

@Injectable()
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public register(email: string, password: string, secretKey: string): Observable<UserModel> {
    return this.httpClient.post<UserModel>(BaseApiUrls.getInviteCommitUrl(secretKey), {
      email,
      password
    });
  }

  public login(email: string, password: string): Observable<UserModel> {
    return this.httpClient.post<UserModel>(BaseApiUrls.getLoginUrl(), {
      email,
      password
    }).pipe(
      tap((user: UserModel) => this.setToken(user)),
      take(1)
    );
  }

  public logOut(): Observable<HttpEvent<any>> {
    return this.httpClient.post<HttpEvent<any>>(BaseApiUrls.getLogoutUrl(), null).pipe(
      tap(_ => {
        this.unauthorizedLogOut();
      })
    );
  }

  public unauthorizedLogOut(): void {
    this.removeTokens();

    window.location.assign('/');
  }

  public checkRegisterSecretKey(secretKey: string): Observable<BaseUserModel> {
    return this.httpClient.get<BaseUserModel>(BaseApiUrls.getInviteUrl(secretKey));
  }

  public refreshToken(): Observable<string> {
    return this.httpClient.post<string>(BaseApiUrls.getRefreshTokenUrl(), {
      refresh: this.getRefreshToken()
    }).pipe(
      map((res: any) => res.access),
      tap((res: string) => localStorage.setItem('access', res))
    );
  }

  public setToken(user: UserModel): void {
    localStorage.setItem('access', user.access);
    localStorage.setItem('refresh', user.refresh);
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refresh')!;
  }

  public getAccessToken(): string {
    return localStorage.getItem('access')!;
  }

  public isAccessTokenExist(): boolean {
    return !!localStorage.getItem('access');
  }

  public removeTokens(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
}
