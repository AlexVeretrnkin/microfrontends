import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { AddBuildingModel, BuildingModel, BuildingTypeModel, CrudInterface, HeadcountModel, PaginationModel, QueryModel } from '@models';

import { ApiUrls } from '../api-urls';
import { map } from 'rxjs/operators';

@Injectable()
export class BuildingService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) { }

  public create(building: BuildingModel): Observable<any> {
    return this.createBuilding(building);
  }

  public delete(building: BuildingModel): Observable<any> {
    return this.removeBuilding(building.id);
  }

  public read(query?: QueryModel<BuildingModel>): Observable<PaginationModel<BuildingModel>> {
    return this.getBuildings(query);
  }

  public update(building: BuildingModel): Observable<any> {
    return this.editBuilding(building);
  }

  public getBuildingTypes(): Observable<PaginationModel<BuildingTypeModel>> {
    return this.httpClient.get<PaginationModel<BuildingTypeModel>>(ApiUrls.getBuildingTypesUrl());
  }

  public getBuildingTypesCount(): Observable<PaginationModel<BuildingTypeModel>> {
    return this.httpClient.get<PaginationModel<BuildingTypeModel>>(ApiUrls.getBuildingTypesCountUrl());
  }

  public createBuildingType(name: string): Observable<BuildingTypeModel> {
    return this.httpClient.post<BuildingTypeModel>(ApiUrls.getBuildingTypesUrl(), {name});
  }

  public editBuildingType(building: BuildingTypeModel): Observable<BuildingTypeModel> {
    return this.httpClient.patch<BuildingTypeModel>(ApiUrls.getBuildingTypesUrl(building.id.toString()), {
      name: building.name
    });
  }

  public removeBuildingType(buildingId: number): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getBuildingTypesUrl(buildingId.toString() + '/'));
  }

  public getBuildings(query?: QueryModel<BuildingModel>): Observable<PaginationModel<BuildingModel>> {
    return this.httpClient.get<PaginationModel<BuildingModel>>(ApiUrls.getBuildingUrl(), {
      params: query?.httpParams
    })
      .pipe(
        map(b => ({
          ...b,
          items: b.items.map(item => new BuildingModel(item))
        }))
      );
  }

  public createBuilding(building: BuildingModel): Observable<BuildingModel[]> {
    return this.httpClient.post<BuildingModel[]>(ApiUrls.getBuildingUrl(), new AddBuildingModel(building));
  }

  public editBuilding(building: BuildingModel): Observable<BuildingModel[]> {
    return this.httpClient.patch<BuildingModel[]>(ApiUrls.getBuildingUrl(building.id.toString()), building);
  }

  public removeBuilding(buildingIid: number): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getBuildingUrl(buildingIid.toString() + '/'));
  }

  public getHeadcount(): Observable<HeadcountModel> {
    return this.httpClient.get<HeadcountModel>(ApiUrls.getHeadCountUrl());
  }
}
