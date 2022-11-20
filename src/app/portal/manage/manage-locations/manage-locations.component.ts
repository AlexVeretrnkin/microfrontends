import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AddLocationModel,
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
import { exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { LocationsService } from '@core';
import { KeyValue } from '@angular/common';
import { YesNoModalComponent } from '@shared';

@Component({
  selector: 'app-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageLocationsComponent implements OnInit {

  public readonly tableOptions: TableOptionsModel<LocationModel> = {
    expandableDataField: 'buildings',
    excludedFields: [...excludedFieldConfig, 'buildings', 'longitude', 'latitude'],
    dataFields: new Map([
      ['coordinates', TableDataFieldTypeEnum.coordinates],
    ]),
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      },
/*      {
        type: TableItemActionEnum.delete,
        classes: 'bg-error-lightest'
      }*/
    ]
  };

  public tableData$!: Observable<TableDataModel<LocationModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private locationsService: LocationsService
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new AddLocationModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<AddLocationModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.locationsService.createLocation(value.data!);
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

  public onControlAction(event: KeyValue<TableItemActionEnum, LocationModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<AddLocationModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.locationsService.editLocation(value.data!);
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

  private deleteItem(event: KeyValue<TableItemActionEnum, LocationModel>): Observable<null> {
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
            return this.locationsService.deleteLocation(event.value.id!);
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('locations'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список місць',
            tableData: data as PaginationModel<LocationModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'locations'}));
  }

  private openInputModal(location?: AddLocationModel): BsModalRef {
    return this.modalService.show<InputModalComponent<AddLocationModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування місця',
            subheading: 'Уведіть/змініть дані',
            inputModel: new AddLocationModel(location),
            excludedFields: [...excludedFieldConfig, 'latitude', 'longitude'],
            fieldsOptions: null!,
            fieldTypes: new Map([
                [
                  'coordinates',
                  {
                    type: InputTypeEnum.Coordinates,
                    isObligatory: true,
                    icon: 'coordinates-icon'
                  }
                ],
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
