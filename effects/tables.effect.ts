import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { concatMap, filter, map, tap } from 'rxjs/operators';

import { CrudInterface, TableStateModel } from '@models';

import {
  ManageUsersService,
  LocationsService,
  BuildingService,
  RoomsService,
  DocumentsService,
  MetersService,
  ContractsService, FloorService, GroupsService, TariffService, SnapshotService, EnvironmentalReadingService
} from '@core';

import { tableActions } from '@actions';
import { QueryModel } from '../models/query.model';

@Injectable()
export class TablesEffects {
  private tableServiceMap: Map<keyof TableStateModel, Observable<TableStateModel[keyof TableStateModel]>> =
    new Map<keyof TableStateModel, Observable<TableStateModel[keyof TableStateModel]>>();

  private crudMap: Map<keyof TableStateModel, CrudInterface> = new Map<keyof TableStateModel, CrudInterface>();

  constructor(
    private actions$: Actions,
    private manageUserService: ManageUsersService,
    private locationsService: LocationsService,
    private buildingService: BuildingService,
    private roomsService: RoomsService,
    private documentsService: DocumentsService,
    private metersService: MetersService,
    private contractsService: ContractsService,
    private floorService: FloorService,
    private groupsService: GroupsService,
    private tariffsService: TariffService,
    private snapshotService: SnapshotService,
    private environmentalReadingService: EnvironmentalReadingService
  ) {
    this.tableServiceMap.set('invitedUsers', this.manageUserService.getInvitedUsers());
    this.tableServiceMap.set('locations', this.locationsService.getLocations());
    this.tableServiceMap.set('buildingTypesCount', this.buildingService.getBuildingTypes());
    this.tableServiceMap.set('documents', this.documentsService.getDocuments());
    this.tableServiceMap.set('contracts', this.contractsService.getContracts());

    this.crudMap.set('floors', this.floorService);
    this.crudMap.set('groups', this.groupsService);
    this.crudMap.set('tariffs', this.tariffsService);
    this.crudMap.set('devices', this.metersService);
    this.crudMap.set('snapshots', this.snapshotService);
    this.crudMap.set('rooms', this.roomsService);
    this.crudMap.set('manageUsers', this.manageUserService);
    this.crudMap.set('usersInGroup', this.manageUserService);
    this.crudMap.set('environmentalReadings', this.environmentalReadingService);
    this.crudMap.set('documentation', this.documentsService);
    this.crudMap.set('buildings', this.buildingService);
  }

  public tables$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(tableActions.initTableData),
      filter(({field}: { field: keyof TableStateModel }) => this.tableServiceMap.has(field)),
      concatMap(({field}: { field: keyof TableStateModel }) =>
        this.tableServiceMap.get(field)!
          .pipe(
            map((data: TableStateModel[keyof TableStateModel]) => {
              return tableActions.setTableData(
                {
                  [field]: data
                }
              );
            })
          )
      )
    )
  );

  public read$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(tableActions.initTableData.type),
      filter(
        (data: { field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel], query: QueryModel<any> }
        ) => this.crudMap.has(data.field)
      ),
      concatMap((data: { field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel], query: QueryModel<any> }) =>
        this.crudMap.get(data.field)!.read(data.query)
          .pipe(
            map((result: TableStateModel[keyof TableStateModel]) => {
              return tableActions.setTableData(
                {
                  [data.field]: result
                }
              );
            })
          )
      )
    )
  );

  public create$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(tableActions.createTableData.type),
      concatMap((data: { field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel], query: QueryModel<any> }) =>
        this.crudMap.get(data.field)!.create(data.item)
          .pipe(
            map(() => tableActions.initTableData({field: data.field!, query: data.query}))
          )
      )
    )
  );

  public update$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(tableActions.updateTableData.type),
      concatMap((data: { field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel], query: QueryModel<any> }) =>
        this.crudMap.get(data.field)!.update(data.item)
          .pipe(
            map(() => tableActions.initTableData({field: data.field!, query: data.query}))
          )
      )
    )
  );

  public delete$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(tableActions.deleteTableData.type),
      concatMap((data: { field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel], query: QueryModel<any> }) =>
        this.crudMap.get(data.field)!.delete(data.item)
          .pipe(
            map(() => tableActions.initTableData({field: data.field!, query: data.query}))
          )
      )
    )
  );
}
