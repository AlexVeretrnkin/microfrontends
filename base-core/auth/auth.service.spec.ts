import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { UserModel } from '@models';

import { environment } from '../../src/environments/environment';
import { TokenResultModel } from '../../src/app/models/auth/token-result.model';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  let httpClientServiceSpy: jasmine.SpyObj<HttpClient>;
  let localStorageSpy: any;

  let expectedResult: any;

  const token: TokenResultModel = new TokenResultModel();
  token.access = 'acc';
  token.refresh = 'ref';

  const apiRoot: string = environment.apiUrl;

  beforeEach((): void => {
    httpClientServiceSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    httpClientServiceSpy.post.and.returnValue(of(null));
    httpClientServiceSpy.get.and.returnValue(of(null));

    service = new AuthService(httpClientServiceSpy);
  });

  afterEach((): void => {
    service = null!;

    httpClientServiceSpy = null!;
    localStorageSpy = null!;

    expectedResult = null;
  });

  describe('register', (): void => {
    it('should call http post request', (done: DoneFn): void => {
      expectedResult = [
        `${apiRoot}auth/register/`,
        new UserModel(
          {
            email: 'em',
            firstName: 'fn',
            lastName: 'ln',
          } as UserModel
        )
      ];

      const user: UserModel = new UserModel(
        {
          email: 'em',
          firstName: 'fn',
          lastName: 'ln',
        } as UserModel
      );

      httpClientServiceSpy.post.calls.reset();

      service.register(user.email, '').subscribe((): void => {
        expect(httpClientServiceSpy.post).toHaveBeenCalledWith(expectedResult[0], expectedResult[1]);

        done();
      });
    });
  });

  describe('login', (): void => {
    beforeEach((): void => {
      httpClientServiceSpy.post.and.returnValue(of(token));
    });

    it('should call http post request', (done: DoneFn): void => {
      expectedResult = [
        `${apiRoot}auth/login/`,
        {
          email: 'em',
          password: 'ps'
        }];

      service.login('em', 'ps').subscribe((): void => {
        expect(httpClientServiceSpy.post).toHaveBeenCalledWith(expectedResult[0], expectedResult[1]);

        done();
      });
    });

    it('should set tokens to local storage', (done: DoneFn): void => {
      expectedResult = new TokenResultModel();
      expectedResult.access = 'acc';
      expectedResult.refresh = 'ref';

      spyOn(service, 'setToken');

      service.login('em', 'ps').subscribe((): void => {
        expect(service.setToken).toHaveBeenCalledWith(expectedResult);

        done();
      });
    });
  });

  describe('refreshToken', (): void => {
    beforeEach((): void => {
      httpClientServiceSpy.post.and.returnValue(of('str'));
    });

    it('should call http post request', (done: DoneFn): void => {
      expectedResult = [
        `${apiRoot}auth/token/refresh/`,
        {
          refresh: 'ref'
        }
      ];

      spyOn(service, 'getRefreshToken').and.returnValue('ref');

      service.refreshToken().subscribe((): void => {
        expect(httpClientServiceSpy.post).toHaveBeenCalledWith(expectedResult[0], expectedResult[1]);

        done();
      });
    });
  });
});
