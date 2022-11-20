import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FieldInputModel, FloorModel, GroupModel, InputTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel, QueryModel,
  RoomModel,
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
import { RoomsService } from '@core';
import { exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { ActivatedRoute } from '@angular/router';
import { RoutesEnum } from '../../../../../routes.enum';

@Component({
  selector: 'app-floor-rooms',
  templateUrl: './floor-rooms.component.html',
  styleUrls: ['./floor-rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorRoomsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<RoomModel> = {
    excludedFields: [
      ...excludedFieldConfig,
      'devices',
      'floorId'
    ],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      },
    ]
  };

  public tableData$!: Observable<TableDataModel<RoomModel>>;

  public contactInfoFormGroup!: FormArray;

  public query: QueryModel<RoomModel> = new QueryModel<RoomModel>();

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private roomsService: RoomsService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    this.query.orderBy = ['index'];
    this.query.filters = {
      floorId: +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageFloorId)!
    };

    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new RoomModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<RoomModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.roomsService.createRoom({
                  ...value.data!,
                  floorId: this.query.filters?.floorId!
                });
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => this.fetchTableData(),
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

  public onControlAction(event: KeyValue<TableItemActionEnum, RoomModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<RoomModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.roomsService.editRoom({
                  ...value.data!,
                  floorId: this.query.filters?.floorId!
                });
              }

              if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event);
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );
        break;
      case TableItemActionEnum.delete:
        this.deleteItem(event)
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );
        break;
    }
  }

  public onPagination(query: QueryModel<RoomModel>): void {
    this.query = new QueryModel({
      ...this.query,
      ...query,
      orderBy: query.orderBy,
    } as QueryModel<RoomModel>);

    this.store.dispatch(tableActions.initTableData({field: 'rooms', query: this.query}));
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, RoomModel>): Observable<null> {
    return this.modalService.show(YesNoModalComponent, {
      initialState: {
        data: {
          subtitle: 'Дані будут видалені',
          title: 'Ви впевнені?'
        }
      }
    }).onHidden
      .pipe(
        switchMap((value: YesNoEnum) => {
          if (value === YesNoEnum.accept) {
            return this.roomsService.deleteRoom(event.value.id!.toString());
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('rooms'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список кімнат',
            tableData: data as PaginationModel<RoomModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'rooms', query: this.query}));
  }

  private openInputModal(type?: RoomModel, excludedFields: Array<keyof RoomModel> = []): BsModalRef {
    return this.modalService.show<InputModalComponent<RoomModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування кімнати',
            subheading: 'Уведіть/змініть дані',
            inputModel: new RoomModel(type),
            excludedFields: [...excludedFieldConfig, ...excludedFields, 'devices', 'floorId'],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );
  }

  private getFieldTypes(): Map<keyof RoomModel, Partial<FieldInputModel<RoomModel>>> {
    const result: Map<keyof RoomModel, Partial<FieldInputModel<RoomModel, FloorModel>>> =
      new Map<keyof RoomModel, Partial<FieldInputModel<RoomModel, FloorModel>>>();

    Object.keys(new RoomModel()).forEach(key => result.set(key as keyof RoomModel, {isObligatory: true}));

    return result;
  }
}
