import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BuildingModel,
  FieldInputModel, FloorModel,
  InputTypeEnum, ModalActionEnum,
  ModalActionModel, PaginationModel,
  StoreModel, TableDataFieldTypeEnum,
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
import { exhaustMap, filter, map, pluck, take, tap } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-floors',
  templateUrl: './manage-floors.component.html',
  styleUrls: ['./manage-floors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageFloorsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<FloorModel> = {
    excludedFields: [...excludedFieldConfig, 'rooms', 'items', 'buildingId'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      }
    ]
  };

  public tableData$!: Observable<TableDataModel<FloorModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
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
        this.openInputModal(new FloorModel())
          .onHidden
          .pipe(
            tap((value: ModalActionModel<FloorModel>) => {
              if (value.action === ModalActionEnum.create) {
                this.store.dispatch(tableActions.createTableData({field: 'floors', item: value.data!}));
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

  public onControlAction(event: KeyValue<TableItemActionEnum, FloorModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            tap((value: ModalActionModel<FloorModel>) => {
              if (value.action === ModalActionEnum.edit) {
                this.store.dispatch(tableActions.updateTableData({
                  field: 'floors',
                  item: new FloorModel(value.data)
                }));
              }
            }),
            exhaustMap((value: ModalActionModel<FloorModel>) => {
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
      case TableItemActionEnum.link:
        this.router.navigate([event.value.id], {relativeTo: this.activatedRoute});
        break;
    }
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, FloorModel>): Observable<null> {
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
            return this.store.dispatch(tableActions.deleteTableData({field: 'floors', item: event.value}));
          }
        }),
        map(_ => null)
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('floors'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список поверхів',
            tableData: data as PaginationModel<FloorModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'floors'}));
  }

  private openInputModal(type?: FloorModel): BsModalRef {
    this.store.dispatch(tableActions.initTableData({field: 'buildings'}));

    return this.modalService.show<InputModalComponent<FloorModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування поверху',
            subheading: 'Уведіть/змініть дані',
            inputModel: new FloorModel(type),
            excludedFields: [...excludedFieldConfig, 'rooms', 'items'],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );
  }

  private getFieldTypes(): Map<keyof FloorModel,  Partial<FieldInputModel<FloorModel, BuildingModel>>> {
    const result: Map<keyof FloorModel,  Partial<FieldInputModel<FloorModel, BuildingModel>>> = new Map();

    Object.keys(new FloorModel()).forEach(key => result.set(key as keyof FloorModel, {isObligatory: true}));

    result.set('buildingId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectField: 'name',
      selectData: this.store.select(selectTable('buildings')).pipe(filter(Boolean), pluck('items')) as Observable<BuildingModel[]>,
      targetSelectionFieldName: 'id'
    });

    return result;
  }
}
