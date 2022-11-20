import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  BuildingModel, FieldInputModel,
  MeterTypeEnum, ModalActionEnum,
  ModalActionModel,
  QueryModel,
  StoreModel,
  TableStateKeysType,
  TableStateModel,
  UserProfileModel, YesNoEnum, FloorModel
} from '@models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BuildingService, ManageUsersService, MetersService } from '@core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RoutesEnum } from '../../../../../routes.enum';
import { selectTable } from '@selectors';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { tableActions } from '@actions';
import { InputModalComponent } from '@portal-shared';
import { excludedFieldConfig } from '@configs';
import { YesNoModalComponent } from '@shared';

@Component({
  selector: 'app-floor-general',
  templateUrl: './floor-general.component.html',
  styleUrls: ['./floor-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorGeneralComponent implements OnInit {
  public floor$!: Observable<FloorModel>;

  private query: QueryModel<FloorModel> = new QueryModel<FloorModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>,
    private manageUsersService: ManageUsersService,
    private buildingService: BuildingService,
    private modalService: BsModalService
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageFloorId)!
    };

    this.floor$ = this.store.select(selectTable('floors'))
      .pipe(
        filter((m: TableStateModel[TableStateKeysType]) => !!m?.totalSize),
        map((m: TableStateModel[TableStateKeysType]) => (m?.items as FloorModel[])
          .find(i => i.id === +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageFloorId)!)!
        ),
      );
  }


  public openInputModal(type?: FloorModel): void {
    this.modalService.show<InputModalComponent<FloorModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування поверха',
            subheading: 'Уведіть/змініть дані',
            inputModel: new FloorModel(type),
            excludedFields: [
              ...excludedFieldConfig,
              'buildingId',
              'items',
              'floorPlanDocumentId',
              'rooms',
            ],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    )
      .onHidden
      .pipe(
        switchMap((value: ModalActionModel<FloorModel>) => {
          if (value.action === ModalActionEnum.edit) {
            this.store.dispatch(tableActions.updateTableData({field: 'floors', item: value.data!}));
          }

          if (value.action === ModalActionEnum.delete) {
            return this.deleteItem(value.data?.id!);
          }

          return of(null!);
        }),
        take(1)
      )
      .subscribe(_ => this.store.dispatch(tableActions.initTableData({field: 'floors', query: this.query})));
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
        tap((value: YesNoEnum) => {
          if (value === YesNoEnum.accept) {
            this.store.dispatch(tableActions.deleteTableData({
              field: 'floors', item: new FloorModel({
                id: event
              })
            }));
          }
        }),
        map(_ => null)
      );
  }

  private getFieldTypes(): Map<keyof FloorModel, Partial<FieldInputModel<FloorModel>>> {
    const result: Map<keyof FloorModel, Partial<FieldInputModel<FloorModel, BuildingModel & UserProfileModel & MeterTypeEnum>>> =
      new Map<keyof FloorModel, Partial<FieldInputModel<FloorModel, BuildingModel & UserProfileModel & MeterTypeEnum>>>();

    Object.keys(new FloorModel()).forEach(key => result.set(key as keyof FloorModel, {isObligatory: false}));

    return result;
  }
}
