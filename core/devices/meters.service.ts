import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { ApiUrls } from '../api-urls';
import { map } from 'rxjs/operators';
import { CrudInterface, MeterModel, PaginationModel } from '@models';
import { QueryModel } from '../../models/query.model';

@Injectable()
export class MetersService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getDevices(): Observable<PaginationModel<MeterModel>> {
    return this.httpClient.get<PaginationModel<MeterModel>>(ApiUrls.getMetersUrl())
      .pipe(
        map(devices => ({
          ...devices,
          items: devices.items.map(d => new MeterModel(d))
        }))
      );
  }

  public create(query?: QueryModel<MeterModel>): Observable<PaginationModel<MeterModel>> {
    return this.httpClient.get<PaginationModel<MeterModel>>(ApiUrls.getMetersUrl(), {
      params: query?.httpParams
    })
      .pipe(
        map(devices => ({
          ...devices,
          items: devices.items.map(d => new MeterModel(d))
        }))
      );
  }

  public delete(args: any): Observable<any> {
    return of(null!);
  }

  public read(query: QueryModel<MeterModel>): Observable<PaginationModel<MeterModel>> {
    return this.httpClient.get<PaginationModel<MeterModel>>(ApiUrls.getMetersUrl(), {
      params: query?.httpParams
    })
      .pipe(
        map(devices => ({
          ...devices,
          items: devices.items.map(d => new MeterModel(d))
        }))
      );
  }

  public update(args: any): Observable<any> {
    return of(null!);
  }

  public createDevice(device: MeterModel): Observable<MeterModel> {
    Object.keys(device).forEach((k: string) => {
      if (device[k as keyof MeterModel] === null) {
        // @ts-ignore
        delete device[k];
      }
      // @ts-ignore
      device[k] = isNaN(device[k]) ? device[k] : parseFloat(device[k]);
    });

    return this.httpClient.post<MeterModel>(ApiUrls.getMetersUrl(), device);
  }

  public editDevice(device: MeterModel): Observable<MeterModel> {
    return this.httpClient.patch<MeterModel>(ApiUrls.getMetersUrl(device.id!.toString()), device);
  }

  public deleteDevice(deviceId: string): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getMetersUrl(deviceId + '/'));
  }
}
