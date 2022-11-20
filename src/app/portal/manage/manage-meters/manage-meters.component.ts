import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BuildingModel,
  ElectricityModel, EnvironmentalReadingModel,
  FieldInputModel,
  InputTypeEnum,
  MeterModel,
  MeterTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel, QueryModel,
  StoreModel,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel,
  TableStateKeysType,
  TableStateModel,
  UserProfileModel,
  YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MetersService } from '@core';
import { concatMap, exhaustMap, filter, map, mergeMap, pluck, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { ExportModalComponent, InputModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-devices',
  templateUrl: './manage-meters.component.html',
  styleUrls: ['./manage-meters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageMetersComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<MeterModel> = {
    excludedFields: [
      ...excludedFieldConfig,
      'deviceType',
      'roomId',
      'manufactureDate',
      'secretKey',
      'recognitionKey',
      'deviceTypeId',
      'readings',
      'buildingId',
      'installationDate',
      'manufactureYear',
      'accountingNumber',
      'relatedContractNumber',
      'lastVerificationDate',
      'snapshots',
      'electricity',
      'responsibleUserId',
      'verificationIntervalSec',
      'otherNotes'
    ],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      }
    ]
  };

  public tableData$!: Observable<TableDataModel<MeterModel>>;

  public contactInfoFormGroup!: FormArray;

  private modalRef!: BsModalRef<InputModalComponent<MeterModel>>;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private devicesService: MetersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();

    // this.modalService.show<ExportModalComponent<MeterModel>>(
    //   ExportModalComponent,
    //   {
    //     initialState: {
    //       inputData: {
    //         heading: 'Експортувати дані про лічильники',
    //         inputModel: new MeterModel(),
    //       }
    //     }
    //   }
    // );
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.store.dispatch(tableActions.initTableData({field: 'buildings'}));

        this.openInputModal(new MeterModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<MeterModel>) => {
              if (value.action === ModalActionEnum.create) {
                if (this.modalRef.content?.modalFormGroup.get('connectionType')?.value) {
                  return this.devicesService.createDevice(new MeterModel(
                    {
                      ...value.data!,
                      electricity: {
                        connectionType: this.modalRef.content?.modalFormGroup.get('connectionType')?.value,
                        transformationCoefficient: parseFloat(this.modalRef.content?.modalFormGroup
                          .get('transformationCoefficient')?.value!)
                      } as ElectricityModel
                    }
                  ));
                } else {
                  return this.devicesService.createDevice(value.data!);
                }
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );

        this.modalRef.content?.modalFormGroup.get('type')?.valueChanges
          .pipe(
            takeUntil(this.modalRef.onHidden)
          )
          .subscribe((value: string) => {
            if (value === MeterTypeEnum.Electricity) {
              this.addElectricityInputs();
            } else {
              this.removeElectricityInputs();
            }
          });

        break;
      case TableEventsEnum.export:
        this.modalService.show<ExportModalComponent<MeterModel>>(
          ExportModalComponent,
          {
            initialState: {
              inputData: {
                heading: 'Експортувати дані про лічильники',
                subheading: null!,
                inputModel: new MeterModel(),
              }
            }
          }
        );
        break;
    }
  }

  public onControlAction(event: KeyValue<TableItemActionEnum, MeterModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal({
          ...event.value
        }).onHidden
          .pipe(
            take(1),
            switchMap((value: ModalActionModel<MeterModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.devicesService.editDevice(value.data!);
              } else if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event);
              } else {
                return of(null!);
              }
            })
          )
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

  public onPagination(paginationQuery: QueryModel<MeterModel>): void {
    const query: QueryModel<MeterModel> = new QueryModel<MeterModel>({
      ...paginationQuery
    } as QueryModel<EnvironmentalReadingModel>);

    this.store.dispatch(tableActions.initTableData({field: 'devices', query}));
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, MeterModel>): Observable<null> {
    return this.modalService.show(YesNoModalComponent, {
      initialState: {
        data: {
          subtitle: 'Дані будут видалені',
          title: 'Ви впевнені?'
        }
      }
    }).onHidden
      .pipe(
        mergeMap((value: YesNoEnum) => {
          console.log(value);

          if (value === YesNoEnum.accept) {
            return this.devicesService.deleteDevice(event.value.id!.toString());
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('devices'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список лічильників',
            tableData: data as PaginationModel<MeterModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'devices'}));
  }

  private openInputModal(type?: MeterModel): BsModalRef {
    this.store.dispatch(tableActions.initTableData({field: 'manageUsers'}));
    this.store.dispatch(tableActions.initTableData({field: 'buildings'}));

    this.modalRef = this.modalService.show<InputModalComponent<MeterModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування лічильника',
            subheading: 'Уведіть/змініть дані',
            inputModel: new MeterModel(type),
            excludedFields: [
              ...excludedFieldConfig,
              'readings',
              'deviceTypeName',
              'deviceType',
              'secretKey',
              'recognitionKey',
              'electricity',
              'snapshots'
            ],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );

    return this.modalRef;
  }

  private getFieldTypes(): Map<keyof MeterModel, Partial<FieldInputModel<MeterModel>>> {
    const result: Map<keyof MeterModel, Partial<FieldInputModel<MeterModel, BuildingModel & UserProfileModel & MeterTypeEnum>>> =
      new Map<keyof MeterModel, Partial<FieldInputModel<MeterModel, BuildingModel & UserProfileModel & MeterTypeEnum>>>();

    Object.keys(new MeterModel()).forEach(key => result.set(key as keyof MeterModel, {isObligatory: false}));

    result.set('manufactureYear', {
      isObligatory: true
    });

    result.set('otherNotes', {
      isObligatory: false
    });

    result.set('type', {
      isObligatory: true,
      type: InputTypeEnum.Select,
      selectData: of(Object.values(MeterTypeEnum)) as Observable<(BuildingModel & UserProfileModel & MeterTypeEnum)[]>
    });

    result.set('serialNumber', {
      isObligatory: true,
    });

    result.set('modelNumber', {
      isObligatory: true,
    });

    result.set('installationDate', {
      isObligatory: true,
      type: InputTypeEnum.Date,
    });

    result.set('lastVerificationDate', {
      isObligatory: true,
      type: InputTypeEnum.Date,
    });

    result.set('buildingId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectField: 'name',
      selectData: this.store.select(selectTable('buildings'))
        .pipe(pluck('items'), filter(Boolean)) as Observable<(BuildingModel & UserProfileModel & MeterTypeEnum)[]>,
      targetSelectionFieldName: 'id'
    });

    result.set('responsibleUserId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectField: 'lastName',
      selectData: this.store.select(selectTable('manageUsers'))
        .pipe(pluck('items'), filter(Boolean)) as Observable<(BuildingModel & UserProfileModel & MeterTypeEnum)[]>,
      targetSelectionFieldName: 'id'
    });

    return result;
  }

  private addElectricityInputs(): void {
    Object.keys(new ElectricityModel()).forEach(k => {
      if (k !== 'meterId' && k !== 'id') {
        this.modalRef.content?.fieldInputs.push({
          formControlName: k as any,
          type: InputTypeEnum.Text,
          isObligatory: true
        });

        this.modalRef.content?.modalFormGroup.addControl(k, new FormControl(null, Validators.required));
      }
    });

    this.modalRef.content?.modalFormGroup.updateValueAndValidity();
  }

  private removeElectricityInputs(): void {
    const keys: string[] = Object.keys(new ElectricityModel());

    this.modalRef.content!.fieldInputs = this.modalRef.content!.fieldInputs.filter(item => !keys.includes(item.formControlName))!;

    Object.keys(new ElectricityModel()).forEach(k => {
      if (k !== 'meterId' && k !== 'id') {
        this.modalRef.content?.modalFormGroup.removeControl(k);
      }
    });

    this.modalRef.content?.modalFormGroup.updateValueAndValidity();
  }
}
