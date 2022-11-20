import { Component, OnInit } from '@angular/core';
import {
  AddSnapshotModel, EnvironmentalReadingModel,
  FieldInputModel,
  InputTypeEnum,
  MeterModel,
  MeterTypeEnum,
  ModalActionEnum,
  ModalActionModel,
  PaginationModel, QueryModel,
  SnapshotModel,
  StoreModel, TableDataFieldTypeEnum,
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InputModalComponent } from '@portal-shared';
import { Store } from '@ngrx/store';
import { tableActions } from '@actions';
import { exhaustMap, filter, map, pluck, take, tap } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { ActivatedRoute } from '@angular/router';
import { RoutesEnum } from '../../../../../routes.enum';

@Component({
  selector: 'app-meter-snapshots',
  templateUrl: './meter-snapshots.component.html',
  styleUrls: ['./meter-snapshots.component.scss']
})

export class MeterSnapshotsComponent implements OnInit {
  public tableOptions: TableOptionsModel<SnapshotModel> = {
    excludedFields: [
      ...excludedFieldConfig,
      'type',
      'electricityMeterSnapshot',
      'heatMeterSnapshot',
      'uptime',
      'creationDate',
      'automatic',
      'meterId',
    ],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      }
    ],
    dataFields: new Map([
      [
        'currentTime',
        TableDataFieldTypeEnum.date
      ]
    ])
  };

  public tableData$!: Observable<TableDataModel<SnapshotModel>>;

  public contactInfoFormGroup!: FormArray;

  public query: QueryModel<SnapshotModel> = new QueryModel<SnapshotModel>();

  private excludedFields: Array<keyof AddSnapshotModel> = ['voltage', 'current'];

  private meter!: MeterModel;

  private modalRef!: BsModalRef<InputModalComponent<AddSnapshotModel>>;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    this.query.orderBy = ['-currentTime'];
    this.query.filters = {
      meterId: +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageMeterId)!
    };

    this.initTableData();

    this.store.select(selectTable('devices'))
      .pipe(
        filter((m: TableStateModel[TableStateKeysType]) => !!m?.totalSize),
        pluck('items'),
        take(2)
      )
      .subscribe((item) => {
        this.meter = item[0] as MeterModel;

        if ((item[0] as MeterModel)?.type === MeterTypeEnum.Electricity) {
          this.excludedFields = [];
        }
      });
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal()
          .onHidden
          .pipe(
            take(1)
          )
          .subscribe(
            (value: ModalActionModel<AddSnapshotModel>) => {
              if (value.action === ModalActionEnum.create) {
                this.store.dispatch(tableActions.createTableData({
                  field: 'snapshots',
                  item: new SnapshotModel({
                    ...value.data!,
                    electricityMeterSnapshot: {
                      current: value.data?.current!,
                      voltage: value.data?.voltage!
                    },
                    meterId: this.meter.id,
                    type: this.meter.type
                  }),
                  query: this.query
                }));
              }
            },
            _ => this.fetchTableData()
          );
        break;
    }
  }

  public onControlAction(event: KeyValue<TableItemActionEnum, SnapshotModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal({
          current: event.value.electricityMeterSnapshot?.current,
          voltage: event.value.electricityMeterSnapshot?.voltage,
          currentTime: event.value.currentTime,
          creationDate: event.value.creationDate,
          consumption: event.value.consumption
        })
          .onHidden
          .pipe(
            tap((value: ModalActionModel<SnapshotModel>) => {
              if (value.action === ModalActionEnum.edit) {
                this.store.dispatch(tableActions.updateTableData({
                  field: 'snapshots',
                  item: {
                    ...event.value,
                    ...value.data
                  },
                  query: this.query
                }));
              }
            }),
            exhaustMap((value: ModalActionModel<SnapshotModel>) => {
              if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event);
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => {
            },
            _ => this.fetchTableData()
          );
        break;
    }
  }

  public onPagination(query: QueryModel<EnvironmentalReadingModel>): void {
    this.query = new QueryModel({
      ...this.query,
      ...query,
      orderBy: query.orderBy,
    } as QueryModel<any>);

    this.store.dispatch(tableActions.initTableData({field: 'snapshots', query: this.query}));
  }

  public getTranslation(): string {
    return 'meter.' + this.meter?.type;
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, SnapshotModel>): Observable<null> {
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
            return this.store.dispatch(tableActions.deleteTableData({field: 'snapshots', item: event.value, query: this.query}));
          }
        }),
        map(_ => null)
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('snapshots'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          if ((data?.items[0] as SnapshotModel)?.type === MeterTypeEnum.Electricity) {
            this.excludedFields = [];
          } else if (data?.items[0]) {
            this.tableOptions.excludedFields?.push(...this.excludedFields);
          }

          return {
            heading: 'Показники лічильника',
            tableData: data as PaginationModel<SnapshotModel>,
          };
        }),
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({
      field: 'snapshots',
      query: this.query
    }));
  }

  private openInputModal(type?: AddSnapshotModel): BsModalRef {
    this.modalRef = this.modalService.show<InputModalComponent<AddSnapshotModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування показника',
            subheading: 'Уведіть/змініть дані',
            inputModel: new AddSnapshotModel(type),
            excludedFields: [...excludedFieldConfig, 'creationDate', ...this.excludedFields],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes(),
            translation: this.getTranslation()
          }
        }
      }
    );

    this.modalRef.content?.modalFormGroup.get('currentTime')?.setValue(new Date());

    return this.modalRef;
  }

  private getFieldTypes(): Map<keyof AddSnapshotModel, Partial<FieldInputModel<AddSnapshotModel>>> {
    const result: Map<keyof AddSnapshotModel, Partial<FieldInputModel<AddSnapshotModel>>> =
      new Map<keyof AddSnapshotModel, Partial<FieldInputModel<AddSnapshotModel>>>();

    Object.keys(new AddSnapshotModel()).forEach(key => result.set(key as keyof AddSnapshotModel, {isObligatory: true}));

    result.set('currentTime', {
      isObligatory: true,
      type: InputTypeEnum.Date
    });


    return result;
  }
}
