import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { CrudInterface, PaginationModel, QueryModel, RoomModel } from '@models';

import { ApiUrls } from '../api-urls';
import { take } from 'rxjs/operators';

@Injectable()
export class RoomsService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) { }

  public read(query?: QueryModel<RoomModel>): Observable<PaginationModel<RoomModel>> {
    return this.httpClient.get<PaginationModel<RoomModel>>(ApiUrls.getRoomsUrl(), {
      params: query?.httpParams
    }).pipe(take(1));
  }

  public delete(args: any): Observable<any> {
    return of(null);
  }

  public create(args: any): Observable<any> {
    return of(null);
  }

  public update(room: RoomModel): Observable<RoomModel> {
    return this.editRoom(room);
  }

  public getRooms(): Observable<PaginationModel<RoomModel>> {
    return this.httpClient.get<PaginationModel<RoomModel>>(ApiUrls.getRoomsUrl());
  }

  public createRoom(room: RoomModel): Observable<RoomModel> {
    return this.httpClient.post<RoomModel>(ApiUrls.getRoomsUrl(), room);
  }

  public editRoom(room: RoomModel): Observable<RoomModel> {
    return this.httpClient.patch<RoomModel>(ApiUrls.getRoomsUrl(room.id!.toString()), room);
  }

  public deleteRoom(roomId: string): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getRoomsUrl(roomId + '/'));
  }
}
