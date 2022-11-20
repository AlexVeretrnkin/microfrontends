import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudInterface, EnvironmentalReadingModel, PaginationModel, QueryModel } from '@models';
import { Observable } from 'rxjs';
import { ApiUrls } from '../api-urls';

@Injectable()
export class EnvironmentalReadingService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public create(reading: EnvironmentalReadingModel): Observable<EnvironmentalReadingModel> {
    return this.httpClient.post<EnvironmentalReadingModel>(ApiUrls.getRoomEnvironmentalReadingsUrl(), reading);
  }

  public delete(reading: EnvironmentalReadingModel): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getRoomEnvironmentalReadingsUrl(reading.id!.toString() + '/'));
  }

  public read(query?: QueryModel<EnvironmentalReadingModel>): Observable<PaginationModel<EnvironmentalReadingModel>> {
    return this.httpClient.get<PaginationModel<EnvironmentalReadingModel>>(ApiUrls.getRoomEnvironmentalReadingsUrl(), {
      params: query?.httpParams
    });
  }

  public update(reading: EnvironmentalReadingModel): Observable<EnvironmentalReadingModel> {
    return this.httpClient.patch<EnvironmentalReadingModel>(ApiUrls.getRoomEnvironmentalReadingsUrl(reading.id!.toString()), reading);
  }
}
