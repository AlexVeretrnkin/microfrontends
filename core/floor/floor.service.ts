import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CrudInterface, GroupModel, PaginationModel, QueryModel } from '@models';
import { Observable } from 'rxjs';
import { ApiUrls } from '../api-urls';

@Injectable()
export class FloorService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) { }

  public read(query?: QueryModel<GroupModel>): Observable<PaginationModel<GroupModel>> {
    return this.httpClient.get<PaginationModel<GroupModel>>(ApiUrls.getFloorUrl(), {
      params: query?.httpParams
    });
  }

  public create(floor: GroupModel): Observable<GroupModel> {
    return this.httpClient.post<GroupModel>(ApiUrls.getFloorUrl(), floor);
  }

  public update(floor: GroupModel): Observable<GroupModel> {
    return this.httpClient.patch<GroupModel>(ApiUrls.getFloorUrl(floor.id!.toString()), floor);
  }

  public delete(floor: GroupModel): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getFloorUrl(floor.id!.toString() + '/'));
  }
}
