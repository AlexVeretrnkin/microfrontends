import { Injectable } from '@angular/core';
import { AddUserToGroupModel, CrudInterface, GroupModel, PaginationModel, QueryModel, UserRoleInGroupEnum } from '@models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrls } from '../api-urls';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class GroupsService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public read(query?: QueryModel<GroupModel>): Observable<PaginationModel<GroupModel>> {
    return this.httpClient.get<PaginationModel<GroupModel>>(ApiUrls.getUsersGroupsUrl(), {
      params: query?.httpParams
    })
      .pipe(
        map(groups => ({
          ...groups,
          items: groups.items.map((g: GroupModel) => new GroupModel(g))
        }))
      );
  }

  public create(group: GroupModel): Observable<GroupModel> {
    return this.httpClient.post<GroupModel>(ApiUrls.getUsersGroupsUrl(), group);
  }

  public delete(group: GroupModel): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getUsersGroupsUrl(group.id!.toString() + '/'));
  }

  public update(group: GroupModel): Observable<GroupModel> {
    return this.httpClient.patch<GroupModel>(ApiUrls.getUsersGroupsUrl(group.id!.toString() + '/'), group);
  }

  public removeUserFromGroup(groupId: number, userId: number): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getUsersGroupsRemoveUserUrl(groupId, userId));
  }

  public addUserToGroup(user: AddUserToGroupModel, groupId: number): Observable<null> {
    if (user.userRole === UserRoleInGroupEnum.admin) {
      return this.httpClient.post<null>(ApiUrls.getUsersGroupsAddAdminUrl(groupId), user);
    }

    return this.httpClient.post<null>(ApiUrls.getUsersGroupsAddUserUrl(groupId), user);
  }
}
