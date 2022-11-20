import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BuildingModel,
  EnvironmentalReadingModel,
  FieldInputModel,
  InputTypeEnum,
  ModalActionEnum,
  ModalActionModel,
  PaginationModel, QueryModel,
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
import { exhaustMap, filter, map, pluck, take, tap } from 'rxjs/operators';
import { tableActions } from '@actions';
import { KeyValue } from '@angular/common';
import { InputModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { ActivatedRoute } from '@angular/router';
import { RoutesEnum } from '../../../../../routes.enum';

@Component({
  selector: 'app-room-environmental-readings',
  templateUrl: './room-environmental-readings.component.html',
  styleUrls: ['./room-environmental-readings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomEnvironmentalReadingsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<EnvironmentalReadingModel> = {
    excludedFields: [...excludedFieldConfig, 'notes', 'roomId', 'automatic'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      }
    ],
    dataFields: new Map<keyof EnvironmentalReadingModel, TableDataFieldTypeEnum>([
      [
        'currentTime',
        TableDataFieldTypeEnum.date
      ]
    ])
  };

  public tableData$!: Observable<TableDataModel<EnvironmentalReadingModel>>;

  public contactInfoFormGroup!: FormArray;

  public startQuery: QueryModel<EnvironmentalReadingModel> = new QueryModel<EnvironmentalReadingModel>();

  private roomId!: number;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    this.startQuery.orderBy = ['-currentTime'];
    this.startQuery.filters = {
      roomId: +this.activatedRoute.snapshot.parent?.paramMap.get(RoutesEnum.manageRoomId)!
    };

    this.initTableData();

    this.store.select(selectTable('rooms'))
      .pipe(
        filter(rooms => !!rooms?.totalSize),
        pluck('items'),
        map(rooms => rooms[0] as RoomModel),
        take(1)
      )
      .subscribe(room => {
        this.roomId = room.id!;
      });
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new EnvironmentalReadingModel())
          .onHidden
          .pipe(
            tap((value: ModalActionModel<EnvironmentalReadingModel>) => {
              if (value.action === ModalActionEnum.create) {
                this.store.dispatch(tableActions.createTableData({
                  field: 'environmentalReadings',
                  item: new EnvironmentalReadingModel(
                    {
                      ...value.data!,
                      roomId: this.roomId
                    }
                  ),
                  query: this.startQuery
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

  public onControlAction(event: KeyValue<TableItemActionEnum, EnvironmentalReadingModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            tap((value: ModalActionModel<EnvironmentalReadingModel>) => {
              if (value.action === ModalActionEnum.edit) {
                this.store.dispatch(tableActions.updateTableData({
                  field: 'environmentalReadings',
                  item: new EnvironmentalReadingModel({
                    ...value.data!,
                    roomId: this.roomId
                  }),
                  query: this.startQuery
                }));
              }
            }),
            exhaustMap((value: ModalActionModel<EnvironmentalReadingModel>) => {
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
    }
  }

  public onPagination(query: QueryModel<EnvironmentalReadingModel>): void {
    this.startQuery = new QueryModel<EnvironmentalReadingModel>({
      ...this.startQuery,
      ...query,
      orderBy: query.orderBy
    } as QueryModel<EnvironmentalReadingModel>);

    this.store.dispatch(tableActions.initTableData({field: 'environmentalReadings', query: this.startQuery}));
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, EnvironmentalReadingModel>): Observable<null> {
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
            return this.store.dispatch(tableActions.deleteTableData({
              field: 'environmentalReadings',
              item: new EnvironmentalReadingModel(
                {
                  ...event.value!,
                  roomId: this.roomId!
                }
              ),
              query: this.startQuery
            }));
          }
        }),
        map(_ => null)
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('environmentalReadings'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Показники середовища ',
            tableData: data as PaginationModel<EnvironmentalReadingModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'environmentalReadings', query: new QueryModel(this.startQuery)}));
  }

  private openInputModal(type?: EnvironmentalReadingModel): BsModalRef {
    const modalRef: BsModalRef<InputModalComponent<EnvironmentalReadingModel>> =
      this.modalService.show<InputModalComponent<EnvironmentalReadingModel>>(
        InputModalComponent,
        {
          initialState: {
            inputData: {
              heading: 'Редагування показника',
              subheading: 'Уведіть/змініть дані',
              inputModel: new EnvironmentalReadingModel(type),
              excludedFields: [...excludedFieldConfig, 'roomId', 'automatic'],
              fieldsOptions: null!,
              fieldTypes: this.getFieldTypes()
            }
          }
        }
      );

    modalRef.content?.modalFormGroup.get('currentTime')?.setValue(new Date());

    return modalRef;
  }

  private getFieldTypes(): Map<keyof EnvironmentalReadingModel, Partial<FieldInputModel<EnvironmentalReadingModel, BuildingModel>>> {
    const result: Map<keyof EnvironmentalReadingModel, Partial<FieldInputModel<EnvironmentalReadingModel, BuildingModel>>> = new Map();

    result.set('humidity', {
      isObligatory: true
    });

    result.set('temperature', {
      isObligatory: true
    });

    result.set('currentTime', {
      isObligatory: true,
      type: InputTypeEnum.Date
    });

    return result;
  }
}
