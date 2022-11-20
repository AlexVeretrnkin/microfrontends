import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  MeterModel,
  StoreModel,
  QueryModel,
  TableStateModel,
  TableStateKeysType,
  UserProfileModel,
  BuildingModel,
  YesNoEnum, FieldInputModel, MeterTypeEnum, InputTypeEnum, ModalActionModel, ModalActionEnum
} from '@models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectTable } from '@selectors';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { RoutesEnum } from '../../../../../routes.enum';
import { tableActions } from '@actions';
import { BuildingService, ManageUsersService, MetersService } from '@core';
import { YesNoModalComponent } from '@shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InputModalComponent } from '@portal-shared';
import { excludedFieldConfig } from '@configs';

@Component({
  selector: 'app-meter-general',
  templateUrl: './meter-general.component.html',
  styleUrls: ['./meter-general.component.scss']
})
export class MeterGeneralComponent implements OnInit {
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
    private metersService: MetersService
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageMeterId)!
    };

    this.meter$ = this.store.select(selectTable('devices'))
      .pipe(
        filter((m: TableStateModel[TableStateKeysType]) => !!m?.totalSize),
        map((m: TableStateModel[TableStateKeysType]) => (m?.items as MeterModel[])
          .find(i => i.id === +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageMeterId)!)!
        ),
        tap(m => {
          this.responsibleUser$ = this.manageUsersService.getUser(m.responsibleUserId);

          this.building$ = this.buildingService.getBuildings(new QueryModel({
            pageSize: null!,
            pageNumber: null!,
            filters: {
              id: m.buildingId
            }
          } as unknown as QueryModel<BuildingModel>))
            .pipe(pluck('items'), map(i => i[0]));
        })
      );
  }


  public openInputModal(type?: MeterModel): void {
    this.store.dispatch(tableActions.initTableData({field: 'manageUsers'}));
    this.store.dispatch(tableActions.initTableData({field: 'buildings'}));

    this.modalService.show<InputModalComponent<MeterModel>>(
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
    )
      .onHidden
      .pipe(
        switchMap((value: ModalActionModel<MeterModel>) => {
          if (value.action === ModalActionEnum.edit) {
            return this.metersService.editDevice(value.data!);
          }

          if (value.action === ModalActionEnum.delete) {
            return this.deleteItem(value.data?.id!);
          }

          return of(null!);
        }),
        take(1)
      )
      .subscribe(_ => this.store.dispatch(tableActions.initTableData({field: 'devices', query: this.query})));
  }

  private deleteItem(event: number): Observable<null> {
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
            return this.metersService.deleteDevice(event.toString());
          }

          return of(null!);
        })
      );
  }

  private getFieldTypes(): Map<keyof MeterModel, Partial<FieldInputModel<MeterModel>>> {
    const result: Map<keyof MeterModel, Partial<FieldInputModel<MeterModel, BuildingModel & UserProfileModel & MeterTypeEnum>>> =
      new Map<keyof MeterModel, Partial<FieldInputModel<MeterModel, BuildingModel & UserProfileModel & MeterTypeEnum>>>();

    Object.keys(new MeterModel()).forEach(key => result.set(key as keyof MeterModel, {isObligatory: false}));

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
}
