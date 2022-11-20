import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { AddLocationModel, LocationModel, PaginationModel } from '@models';

import { ApiUrls } from '../api-urls';
import { catchError, map } from 'rxjs/operators';


@Injectable()
export class LocationsService {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getLocations(): Observable<PaginationModel<LocationModel>> {
    return this.httpClient.get<PaginationModel<LocationModel>>(ApiUrls.getLocationsUrl())
      .pipe(
        map(locations => ({
          ...locations,
          items: locations.items.map(loc => new LocationModel(loc))
        }))
      );
  }

  public createLocation(location: AddLocationModel): Observable<LocationModel> {
    return this.httpClient.post<LocationModel>(ApiUrls.getLocationsUrl(), location);
  }

  public editLocation(location: AddLocationModel): Observable<LocationModel> {
    return this.httpClient.patch<LocationModel>(ApiUrls.getLocationsUrl(location.id?.toString()), location);
  }

  public deleteLocation(id: number): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getLocationDeleteUrl(id?.toString()));
  }
}
