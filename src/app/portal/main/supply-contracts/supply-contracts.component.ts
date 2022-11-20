import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ContractModel,
  FieldInputModel,
  InputTypeEnum, MeterTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel, TableStateKeysType, TableStateModel, YesNoEnum
} from '@models';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContractsService, FileHelperService } from '@core';
import { exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { excludedFieldConfig } from '@configs';

@Component({
  selector: 'app-supply-contracts',
  templateUrl: './supply-contracts.component.html',
  styleUrls: ['./supply-contracts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplyContractsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<ContractModel> = {
    excludedFields: ['id', 'created', 'updated', 'fileUrl', 'fileSize', 'fileName', 'file', 'notes', 'name'],
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
      ['expirationDate', TableDataFieldTypeEnum.date],
      ['startDate', TableDataFieldTypeEnum.date]
    ])
  };

  public tableData$!: Observable<TableDataModel<ContractModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private contractsService: ContractsService,
    private fileHelper: FileHelperService
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new ContractModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<ContractModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.contractsService.createContract(value.data!);
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

  public onControlAction(event: KeyValue<TableItemActionEnum, ContractModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal({
          ...event.value,
          file: event.value.fileName as string,
        })
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<ContractModel>) => {
              if (value.action === ModalActionEnum.edit) {
                console.log(value.data);

                return this.contractsService.editContract({
                  ...value.data!,
                  id: event.value.id
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
      case TableItemActionEnum.download:
        this.fileHelper.downloadFileByUrl(event.value.fileUrl, event.value.fileName);
        break;
      case TableItemActionEnum.link:
        window.open(event.value.fileUrl);
        break;
    }
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, ContractModel>): Observable<null> {
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
            return this.contractsService.removeContract(event.value.id!.toString());
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('contracts'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список договорів енергопостачання',
            tableData: data as PaginationModel<ContractModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'contracts'}));
  }

  private openInputModal(doc?: ContractModel): BsModalRef {
    return this.modalService.show<InputModalComponent<ContractModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування договору енергопостачання',
            subheading: 'Уведіть/змініть дані',
            inputModel: new ContractModel(doc),
            excludedFields: [...excludedFieldConfig, 'fileName', 'fileUrl', 'fileSize', 'name'],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );
  }

  private getFieldTypes(): Map<keyof ContractModel, Partial<FieldInputModel<ContractModel>>> {
    const result: Map<keyof ContractModel, Partial<FieldInputModel<ContractModel>>> =
      new Map<keyof ContractModel, Partial<FieldInputModel<ContractModel>>>();

    Object.keys(new ContractModel()).forEach(key => result.set(key as keyof ContractModel, {isObligatory: false}));

    result.set('number', {
      isObligatory: true
    });

    result.set('file', {
      isObligatory: true,
      type: InputTypeEnum.File,
      icon: 'file-icon'
    });

    result.set('type', {
      isObligatory: true,
      type: InputTypeEnum.Select,
      selectData: of(Object.values(MeterTypeEnum))
    });

    result.set('expirationDate', {
      isObligatory: true,
      type: InputTypeEnum.Date,
    });

    result.set('startDate', {
      isObligatory: true,
      type: InputTypeEnum.Date,
    });

    return result;
  }
}
