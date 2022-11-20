import { Component, OnInit } from '@angular/core';
import {
  AddTariffModel,
  FieldInputModel,
  InputTypeEnum, MeterTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel,
  TableStateKeysType,
  TableStateModel,
  TariffModel,
  YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { tableActions } from '@actions';
import { KeyValue } from '@angular/common';
import { InputModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { FileHelperService } from '@core';

@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<TariffModel> = {
    excludedFields: [...excludedFieldConfig, 'notes', 'fileSize', 'fileUrl', 'file', 'fileName'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      },
      {
        type: TableItemActionEnum.download,
      }
    ],
    dataFields: new Map([
      [
        'enactedSince',
        TableDataFieldTypeEnum.date
      ]
    ])
  };

  public tableData$!: Observable<TableDataModel<TariffModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private fileHelper: FileHelperService
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new TariffModel())
          .onHidden
          .pipe(
            tap((value: ModalActionModel<TariffModel>) => {
              if (value.action === ModalActionEnum.create) {
                this.store.dispatch(tableActions.createTableData({field: 'tariffs', item: value.data!}));
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

  public onControlAction(event: KeyValue<TableItemActionEnum, TariffModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal({
          ...event.value,
          file: event.value.fileName
        })
          .onHidden
          .pipe(
            tap((value: ModalActionModel<TariffModel>) => {
              if (value.action === ModalActionEnum.edit) {
                this.store.dispatch(tableActions.updateTableData({
                  field: 'tariffs',
                  item: value.data!
                }));
              }
            }),
            exhaustMap((value: ModalActionModel<TariffModel>) => {
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
      case TableItemActionEnum.download:
        this.fileHelper.downloadFileByUrl(event.value.fileUrl, event.value.fileName);
        break;
      case TableItemActionEnum.link:
        window.open(event.value.fileUrl);
        break;
    }
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, TariffModel>): Observable<null> {
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
            return this.store.dispatch(tableActions.deleteTableData({field: 'tariffs', item: event.value}));
          }
        }),
        map(_ => null)
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('tariffs'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Тарифи на енергоносії',
            tableData: data as PaginationModel<TariffModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'tariffs'}));
  }

  private openInputModal(type?: AddTariffModel): BsModalRef {
    return this.modalService.show<InputModalComponent<AddTariffModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування тарифів',
            subheading: 'Уведіть/змініть дані',
            inputModel: new AddTariffModel(type),
            excludedFields: [...excludedFieldConfig],
            fieldsOptions: null!,
            fieldTypes: new Map<keyof AddTariffModel, Partial<FieldInputModel<AddTariffModel>>>([
              [
                'enactedSince',
                {
                  type: InputTypeEnum.Date
                }
              ],
              [
                'file',
                {
                  type: InputTypeEnum.File,
                  icon: 'file-icon'
                }
              ],
              [
                'type',
                {
                  isObligatory: true,
                  type: InputTypeEnum.Select,
                  selectData: of(Object.values(MeterTypeEnum))
                }
              ]
            ])
          }
        }
      }
    );
  }
}
