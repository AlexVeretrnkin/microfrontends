import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AddBuildingModel,
  BuildingModel,
  BuildingTypeModel,
  FieldInputModel,
  InputTypeEnum,
  LocationModel,
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
  YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BuildingService } from '@core';
import { exhaustMap, filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { ExtendedInputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-buildings',
  templateUrl: './manage-buildings.component.html',
  styleUrls: ['./manage-buildings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageBuildingsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<BuildingModel> = {
    excludedFields: [
      ...excludedFieldConfig,
      'buildingType',
      'responsibleUsers',
      'rooms',
      'buildingIndex',
      'locationId',
      'buildingTypeId',
      'workingHelp',
      'workingScience',
      'lastCapitalRepairYear',
      'studyingDaytime',
      'workingTeachers',
      'studyingPartTime',
      'studyingEveningTime',
      'livingQuantity',
      'location',
      'photoDocumentId',
      'constructionType',
      'climateZone',
      'heatSupplyContractId',
      'electricitySupplyContractId',
      'waterSupplyContractId',
      'operationSchedule',
      'operationHoursPerYear',
      'utilizedSpace',
      'utilitySpace',
      'floors',
      'meters',
      'responsiblePeople',
    ],
    dataFields: new Map<keyof BuildingModel, TableDataFieldTypeEnum>([
      [
        'locationCoordinates',
        TableDataFieldTypeEnum.coordinates
      ]
    ]),
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      },
    ]
  };

  public tableData$!: Observable<TableDataModel<BuildingModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private buildingService: BuildingService,
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
        this.openInputModal(new BuildingModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<BuildingModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.buildingService.createBuilding(value.data!);
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

  public onControlAction(event: KeyValue<TableItemActionEnum, BuildingModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal({
          ...event.value as unknown as AddBuildingModel,
          // @ts-ignore
          locationId: event.value?.location.name!,
          // @ts-ignore
          buildingTypeId: event.value?.buildingTypeName!
        })
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<BuildingModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.buildingService.editBuilding({
                  ...value.data!,
                  locationId: value.data!.locationId.toString() !== event.value?.location.name ?
                    value.data?.locationId! :
                    event.value!.locationId,
                  buildingTypeId: value.data?.buildingTypeId!.toString() !== event.value?.buildingTypeName! ?
                    value.data?.buildingTypeId! :
                    event.value!.buildingTypeId
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
      case TableItemActionEnum.link:
        this.router.navigate([event.value.id], {relativeTo: this.activatedRoute});
        break;
    }
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, BuildingModel>): Observable<null> {
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
            return this.buildingService.removeBuilding(event.value.id!);
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('buildings'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список будівель',
            tableData: data as PaginationModel<BuildingModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'buildings'}));
  }

  private openInputModal(type?: AddBuildingModel, excludedFields: Array<keyof AddBuildingModel> = []): BsModalRef {
    this.store.dispatch(tableActions.initTableData({field: 'locations'}));
    this.store.dispatch(tableActions.initTableData({field: 'buildingTypesCount'}));

    return this.modalService.show<ExtendedInputModalComponent<AddBuildingModel>>(
      ExtendedInputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування будівлі',
            subheading: 'Уведіть/змініть дані',
            inputModel: new AddBuildingModel(type),
            excludedFields: [...excludedFieldConfig, ...excludedFields],
            fieldsOptions: new Map(
              [
                ['Загальні дані', [
                  {
                    formControlName: 'locationId',
                    isObligatory: true,
                    type: InputTypeEnum.TypeHead,
                    selectField: 'name',
                    selectData: this.store.select(selectTable('locations'))
                      .pipe(pluck('items'), filter(Boolean)) as Observable<LocationModel[]>,
                    targetSelectionFieldName: 'id'
                  },
                  {
                    formControlName: 'buildingTypeId',
                    isObligatory: true,
                    type: InputTypeEnum.TypeHead,
                    selectField: 'name',
                    selectData: this.store.select(selectTable('buildingTypesCount'))
                      .pipe(pluck('items'), filter(Boolean)) as Observable<BuildingTypeModel[]>,
                    targetSelectionFieldName: 'id'
                  },
                  {
                    formControlName: 'name',
                    isObligatory: true,
                  },
                  {
                    formControlName: 'address'
                  },
                  {
                    formControlName: 'photoDocumentId'
                  },
                  {
                    formControlName: 'constructionType',
                  },
                  {
                    formControlName: 'constructionYear',
                  },
                  {
                    formControlName: 'climateZone',
                  },
                  {
                    formControlName: 'utilizedSpace',
                  },
                  {
                    formControlName: 'utilitySpace',
                  }
                ]],
                ['Договори', [
                  {
                    formControlName: 'heatSupplyContractId',
                  },
                  {
                    formControlName: 'electricitySupplyContractId',
                  },
                  {
                    formControlName: 'waterSupplyContractId',
                  },
                ]],
                ['Кількість осіб', [
                  {
                    formControlName: 'studyingDaytime',
                  },
                  {
                    formControlName: 'studyingPartTime',
                  },
                  {
                    formControlName: 'studyingEveningTime',
                  },
                  {
                    formControlName: 'workingTeachers',
                  },
                  {
                    formControlName: 'workingScience',
                  },
                  {
                    formControlName: 'workingHelp',
                  },
                  {
                    formControlName: 'livingQuantity',
                  },
                ]],
                ['Розклад', [
                  {
                    formControlName: 'operationSchedule',
                  },
                  {
                    formControlName: 'operationHoursPerYear',
                  },
                ]],
              ]
            ),
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );
  }

  private getFieldTypes(): Map<keyof AddBuildingModel, Partial<FieldInputModel<AddBuildingModel>>> {
    const result: Map<keyof AddBuildingModel, Partial<FieldInputModel<AddBuildingModel, LocationModel | BuildingTypeModel>>> =
      new Map<keyof AddBuildingModel, Partial<FieldInputModel<AddBuildingModel, LocationModel | BuildingTypeModel>>>();

    result.set('name', {
      isObligatory: true
    });

    result.set('locationId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectField: 'name',
      selectData: this.store.select(selectTable('locations'))
        .pipe(pluck('items'), filter(Boolean)) as Observable<LocationModel[]>,
      targetSelectionFieldName: 'id'
    });

    result.set('buildingTypeId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectField: 'name',
      selectData: this.store.select(selectTable('buildingTypesCount'))
        .pipe(pluck('items'), filter(Boolean)) as Observable<BuildingTypeModel[]>,
      targetSelectionFieldName: 'id'
    });

    return result;
  }
}
