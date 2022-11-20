import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddSnapshotModel, CrudInterface, PaginationModel, QueryModel, SnapshotModel } from '@models';
import { Observable } from 'rxjs';
import { ApiUrls } from '../api-urls';
import { map } from 'rxjs/operators';

@Injectable()
export class SnapshotService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public read(query?: QueryModel<SnapshotModel>): Observable<PaginationModel<SnapshotModel>> {
    return this.httpClient.get<PaginationModel<SnapshotModel>>(ApiUrls.getSnapshotsUrl(), {
      params: query?.httpParams
    })
      .pipe(
        map(res => ({
          ...res,
          items: res.items.map(r => new SnapshotModel(r))
        }))
      );
  }

  public delete(snapshot: SnapshotModel): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getSnapshotsUrl(snapshot.id!.toString() + '/'));
  }

  public create(snapshot: SnapshotModel): Observable<SnapshotModel> {
    const snap: SnapshotModel = new SnapshotModel(snapshot);
    if (snapshot.current! && snapshot.voltage!) {
      snap.electricity = {
        current: snapshot.current!,
        voltage: snapshot.voltage!
      } as any;
    }
    snap.current = null!;
    snap.voltage = null!;

    return this.httpClient.post<SnapshotModel>(ApiUrls.getSnapshotsUrl(), snap);
  }

  public update(snapshot: SnapshotModel): Observable<any> {
    const snap: SnapshotModel = new SnapshotModel(snapshot);
    if (snapshot.current! && snapshot.voltage!) {
      snap.electricity = {
        current: snapshot.current!,
        voltage: snapshot.voltage!
      } as any;
    }
    snap.current = null!;
    snap.voltage = null!;

    return this.httpClient.patch<SnapshotModel>(ApiUrls.getSnapshotsUrl(snapshot.id!.toString()), snap);
  }
}
