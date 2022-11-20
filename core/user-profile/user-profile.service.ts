import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable } from 'rxjs';

import { CamelCaseHelperService } from '@base-core';

import { ContactInfoModel, UserProfileModel } from '@models';

import { ApiUrls } from '../api-urls';
import { map } from 'rxjs/operators';

@Injectable()
export class UserProfileService {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getUser(): Observable<UserProfileModel> {
    return this.httpClient.get<UserProfileModel>(ApiUrls.getUserUrl());
  }

  public updateUserInfo(user: UserProfileModel): Observable<any> {
    const contactInfos: ContactInfoModel[] = user?.contactInfos.map(info => !!info?.id ? info : {
      name: info.name,
      type: info.type,
      value: info.value,
      notes: info.notes
    });

    return this.httpClient.patch(ApiUrls.getUserByIdUrl(user.id!), {
      ...user,
      contactInfos
    });
  }

  public updateUserPhoto(userId: number, photo: File): Observable<UserProfileModel> {
    const formData: FormData = new FormData();

    formData.append('photo', photo);

    return this.httpClient.patch<UserProfileModel>(ApiUrls.getUserByIdUrl(userId), formData);
  }

  public updateUserContactInfos(userId: number, contactInfos: ContactInfoModel[]): Observable<ContactInfoModel[]> {
    return this.httpClient.patch<ContactInfoModel[]>(ApiUrls.getUserByIdUrl(userId), contactInfos);
  }

  public deleteContacts(contactIds: number[]): Observable<null> {
    return combineLatest(
      contactIds.map(contactId => this.httpClient.delete<null>(ApiUrls.getUserContactInfoUrl(contactId.toString() + '/')))
    )
      .pipe(
        map(_ => null)
      );
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<null> {
    return this.httpClient.post<null>(ApiUrls.getChangePasswordUrl(), {
      oldPassword,
      newPassword
    });
  }
}
