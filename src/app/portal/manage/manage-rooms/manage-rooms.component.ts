import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FieldInputModel, FloorModel,
  InputTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel,
  RoomModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel,
  TableStateKeysType,
  TableStateModel,
  YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoomsService } from '@core';
import { exhaustMap, map, pluck, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrls: ['./manage-rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageRoomsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<RoomModel> = {
    excludedFields: [
      ...excludedFieldConfig,
      'devices',
      'floorId'
    ],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      },
    ]
  };

  public tableData$!: Observable<TableDataModel<RoomModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private roomsService: RoomsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
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
                return this.roomsService.createRoom(value.data!);
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
        this.openInputModal(event.value, ['designation', 'responsibleDepartment', 'size'])
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<RoomModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.roomsService.editRoom(value.data!);
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
      case TableItemActionEnum.link:
        this.router.navigate([event.value.id], {relativeTo: this.activatedRoute});
        break;
    }
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
    this.store.dispatch(tableActions.initTableData({field: 'rooms'}));
  }

  private openInputModal(type?: RoomModel, excludedFields: Array<keyof RoomModel> = []): BsModalRef {
    this.store.dispatch(tableActions.initTableData({field: 'floors'}));

    return this.modalService.show<InputModalComponent<RoomModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування кімнати',
            subheading: 'Уведіть/змініть дані',
            inputModel: new RoomModel(type),
            excludedFields: [...excludedFieldConfig, ...excludedFields, 'devices'],
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

    result.set('floorId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectData: this.store.select(selectTable('floors')).pipe(pluck('items')) as Observable<FloorModel[]>,
      selectField: 'index',
      targetSelectionFieldName: 'id'
    });

    return result;
  }
}
