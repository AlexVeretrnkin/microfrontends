import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BuildingTypeModel,
  ModalActionEnum,
  ModalActionModel, PaginationModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel, TableStateKeysType, TableStateModel, YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BuildingService } from '@core';
import { exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';

@Component({
  selector: 'app-manage-building-types',
  templateUrl: './manage-building-types.component.html',
  styleUrls: ['./manage-building-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageBuildingTypesComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<BuildingTypeModel> = {
    excludedFields: [...excludedFieldConfig],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      }
    ]
  };

  public tableData$!: Observable<TableDataModel<BuildingTypeModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private buildingService: BuildingService
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new BuildingTypeModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<BuildingTypeModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.buildingService.createBuildingType(value.data!.name);
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

  public onControlAction(event: KeyValue<TableItemActionEnum, BuildingTypeModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<BuildingTypeModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.buildingService.editBuildingType(value.data!);
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
    }
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, BuildingTypeModel>): Observable<null> {
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
            return this.buildingService.removeBuildingType(event.value.id!);
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('buildingTypesCount'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список типів будівель',
            tableData: data as PaginationModel<BuildingTypeModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'buildingTypesCount'}));
  }

  private openInputModal(type?: BuildingTypeModel): BsModalRef {
    return this.modalService.show<InputModalComponent<BuildingTypeModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування типу приміщення',
            subheading: 'Уведіть/змініть дані',
            inputModel: new BuildingTypeModel(type),
            excludedFields: [...excludedFieldConfig, 'buildings', 'buildingsCount'],
            fieldsOptions: null!,
            fieldTypes: new Map([
                [
                  'name',
                  {
                    isObligatory: true
                  }
                ]
              ]
            )
          }
        }
      }
    );
  }
}
