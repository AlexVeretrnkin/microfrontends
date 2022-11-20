import { Component, OnInit } from '@angular/core';
import {
  BuildingModel, EnvironmentalReadingModel,
  FieldInputModel,
  FloorModel, InputTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel, QueryModel,
  StoreModel, TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel, TableStateKeysType, TableStateModel, YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { exhaustMap, filter, map, pluck, take, tap } from 'rxjs/operators';
import { tableActions } from '@actions';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { RoutesEnum } from '../../../../../routes.enum';

@Component({
  selector: 'app-building-floors',
  templateUrl: './building-floors.component.html',
  styleUrls: ['./building-floors.component.scss']
})
export class BuildingFloorsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<FloorModel> = {
    excludedFields: [...excludedFieldConfig, 'rooms', 'items', 'buildingId'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      }
    ]
  };

  public tableData$!: Observable<TableDataModel<FloorModel>>;

  public contactInfoFormGroup!: FormArray;

  public query: QueryModel<FloorModel> = new QueryModel<FloorModel>();

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.query.filters = {
      buildingId: +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageBuildingId)!
    };

    this.query.orderBy = ['-index'];

    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new FloorModel())
          .onHidden
          .pipe(
            tap((value: ModalActionModel<FloorModel>) => {
              if (value.action === ModalActionEnum.create) {
                this.store.dispatch(tableActions.createTableData({
                  field: 'floors',
                  item: {
                    ...value.data!,
                    buildingId: this.query.filters?.buildingId!
                  },
                  query: this.query
                }));
              }
            }),
            take(1)
          )
          .subscribe(
            _ => null,
            _ => this.fetchTableData()
          );
        break;
    }
  }

  public onItemAction(event: KeyValue<TableDataFieldTypeEnum, string>): void {
    switch (event.key) {
      case TableDataFieldTypeEnum.coordinates:
        const [latitude, longitude]: string[] = event.value.split(' ');

        this.modalService.show(MapViewerModalComponent, {
          initialState: {
            coordinates: new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude))
          }
        });
        break;
    }
  }

  public onControlAction(event: KeyValue<TableItemActionEnum, FloorModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            tap((value: ModalActionModel<FloorModel>) => {
              if (value.action === ModalActionEnum.edit) {
                this.store.dispatch(tableActions.updateTableData({
                  field: 'floors',
                  item: new FloorModel({
                    ...value.data
                  }),
                  query: this.query
                }));
              }
            }),
            exhaustMap((value: ModalActionModel<FloorModel>) => {
              if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event);
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => null,
            _ => this.fetchTableData()
          );
        break;
      case TableItemActionEnum.link:
        this.router.navigate([RoutesEnum.portal, RoutesEnum.manage, RoutesEnum.manageBuildingFloors, event.value.id]);
        break;
    }
  }

  public onPagination(query: QueryModel<FloorModel>): void {
    this.query = new QueryModel({
      ...this.query,
      ...query,
      orderBy: query.orderBy,
    } as QueryModel<FloorModel>);

    this.store.dispatch(tableActions.initTableData({field: 'floors', query: this.query}));
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, FloorModel>): Observable<null> {
    return this.modalService.show(YesNoModalComponent, {
      initialState: {
        data: {
          subtitle: 'Дані будут видалені',
          title: 'Ви впевнені?'
        }
      }
    }).onHidden
      .pipe(
        tap((value: YesNoEnum) => {
          if (value === YesNoEnum.accept) {
            return this.store.dispatch(tableActions.deleteTableData({field: 'floors', item: event.value}));
          }
        }),
        map(_ => null)
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('floors'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список поверхів',
            tableData: data as PaginationModel<FloorModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'floors', query: this.query}));
  }

  private openInputModal(type?: FloorModel): BsModalRef {
    return this.modalService.show<InputModalComponent<FloorModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування поверху',
            subheading: 'Уведіть/змініть дані',
            inputModel: new FloorModel(type),
            excludedFields: [...excludedFieldConfig, 'rooms', 'items', 'buildingId'],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );
  }

  private getFieldTypes(): Map<keyof FloorModel, Partial<FieldInputModel<FloorModel, BuildingModel>>> {
    const result: Map<keyof FloorModel, Partial<FieldInputModel<FloorModel, BuildingModel>>> = new Map();

    Object.keys(new FloorModel()).forEach(key => result.set(key as keyof FloorModel, {isObligatory: true}));

    return result;
  }
}
