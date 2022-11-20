import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AddBuildingModel,
  BuildingModel,
  BuildingTypeModel,
  FieldInputModel,
  InputTypeEnum,
  LocationModel,
  MeterModel,
  ModalActionEnum,
  ModalActionModel,
  QueryModel,
  StoreModel,
  TableStateKeysType,
  TableStateModel,
  UserProfileModel,
  YesNoEnum
} from '@models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BuildingService, ManageUsersService } from '@core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RoutesEnum } from '../../../../../routes.enum';
import { selectTable } from '@selectors';
import { filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { tableActions } from '@actions';
import { ExtendedInputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { excludedFieldConfig } from '@configs';
import { YesNoModalComponent } from '@shared';

@Component({
  selector: 'app-building-general',
  templateUrl: './building-general.component.html',
  styleUrls: ['./building-general.component.scss']
})
export class BuildingGeneralComponent implements OnInit {
  public meter$!: Observable<MeterModel>;
  public responsibleUser$!: Observable<UserProfileModel>;
  public building$!: Observable<BuildingModel>;

  public readonly meterFields: string[] = Object.keys(new MeterModel());

  private query: QueryModel<MeterModel> = new QueryModel<MeterModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>,
    private manageUsersService: ManageUsersService,
    private buildingService: BuildingService,
    private modalService: BsModalService,
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageBuildingId)!
    };

    this.building$ = this.store.select(selectTable('buildings')).pipe(
      filter((m: TableStateModel[TableStateKeysType]) => !!m?.totalSize),
      map((m: TableStateModel[TableStateKeysType]) => m?.items[0] as BuildingModel)
    );
  }

  public openInputModal(type?: AddBuildingModel, excludedFields: Array<keyof AddBuildingModel> = []): void {
    this.store.dispatch(tableActions.initTableData({field: 'locations'}));
    this.store.dispatch(tableActions.initTableData({field: 'buildingTypesCount'}));

    this.modalService.show<ExtendedInputModalComponent<AddBuildingModel>>(
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
    ).onHidden
      .pipe(
        switchMap((value: ModalActionModel<BuildingModel>) => {
          if (value.action === ModalActionEnum.delete) {
            return this.deleteItem(value.data!);
          }

          return of(value);
        }),
        take(1)
      ).subscribe((value: ModalActionModel<BuildingModel> | null) => {
      if (value?.action === ModalActionEnum.edit) {
        this.store.dispatch(tableActions.updateTableData({
          field: 'buildings',
          item: {
            ...value.data!,
            locationId: value.data?.locationId!,
            buildingTypeId: this.query.filters?.id!
          },
          query: this.query
        }));
      }
    });
  }

  public openCard(coordinates: string): void {
    const [latitude, longitude]: string[] = coordinates.split(' ');

    this.modalService.show(MapViewerModalComponent, {
      initialState: {
        coordinates: new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude))
      }
    });
  }

  private deleteItem(data: BuildingModel): Observable<null> {
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
            return this.buildingService.removeBuilding(data.id!);
          }

          return of(null!);
        })
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
