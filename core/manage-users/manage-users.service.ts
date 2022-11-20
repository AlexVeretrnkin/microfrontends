import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { AddUserModel, ContactInfoModel, CrudInterface, InvitedUserModel, PaginationModel, QueryModel, UserProfileModel } from '@models';

import { ApiUrls } from '../api-urls';
import { concatMap, map } from 'rxjs/operators';

@Injectable()
export class ManageUsersService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public create(args: any): Observable<any> {
    return of(null);
  }

  public delete(args: any): Observable<any> {
    return of(null);
  }

  public read(query?: QueryModel<UserProfileModel>): Observable<PaginationModel<UserProfileModel>> {
    return this.httpClient.get<PaginationModel<UserProfileModel>>(ApiUrls.getUsersUrl(), {
      params: query?.httpParams
    });
  }

  public update(args: any): Observable<any> {
    return of(null);
  }

  public getUsers(): Observable<PaginationModel<UserProfileModel>> {
    return this.httpClient.get<PaginationModel<UserProfileModel>>(ApiUrls.getUsersUrl());
  }

  public getUser(id: number): Observable<UserProfileModel> {
    return this.httpClient.get<UserProfileModel>(ApiUrls.getUserByIdUrl(id));
  }

  public getInvitedUsers(): Observable<PaginationModel<InvitedUserModel>> {
    return this.httpClient.get<PaginationModel<InvitedUserModel>>(ApiUrls.getUserInvitesUrl())
      .pipe(
        map((users: PaginationModel<InvitedUserModel>) => ({
          ...users,
          items: users.items.map(user => new InvitedUserModel(user))
        }))
      );
  }

  public createUser(user: AddUserModel): Observable<InvitedUserModel> {
    const contactInfos: ContactInfoModel[] = user?.contactInfos.filter(info => Object.values(info).every(item => !!item));

    if (user.photo) {
      const formData: FormData = new FormData();
      formData.append('photo', user.photo);

      delete user.photo;

      return this.httpClient.post<InvitedUserModel>(ApiUrls.getUsersAddUrl(), {
        ...user,
        contactInfos
      })
        .pipe(
          concatMap(({invitee}) => this.httpClient.patch<InvitedUserModel>(ApiUrls.getUserByIdUrl(invitee.id!), formData))
        );
    }

    return this.httpClient.post<InvitedUserModel>(ApiUrls.getUsersAddUrl(), {
      ...user,
      contactInfos
    });
  }

  public editUser(user: AddUserModel): Observable<InvitedUserModel> {
    const contactInfos: ContactInfoModel[] = user?.contactInfos.map(info => !!info?.id ? info : {
      name: info.name,
      type: info.type,
      value: info.value,
      notes: info.notes
    });

    if (user.photo) {
      const formData: FormData = new FormData();
      formData.append('photo', user?.photo as File);

      delete user.photo;

      return this.httpClient.patch<InvitedUserModel>(ApiUrls.getUserByIdUrl(user.id!), formData)
        .pipe(
          concatMap(_ => this.httpClient.patch<InvitedUserModel>(ApiUrls.getUserByIdUrl(user.id!), {
            ...user,
            contactInfos
          }))
        );
    }

    return this.httpClient.patch<InvitedUserModel>(ApiUrls.getUserByIdUrl(user.id!), {
      ...user,
      contactInfos
    });
  }

  public deleteUser(userId: number): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getUserByIdUrl(userId));
  }
}
