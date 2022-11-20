import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FieldInputModel,
  GroupModel,
  InputTypeEnum,
  ModalActionEnum,
  ModalActionModel,
  PaginationModel,
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
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { tableActions } from '@actions';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageGroupsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<GroupModel> = {
    excludedFields: [...excludedFieldConfig, 'users', 'admin', 'permissions', 'parentGroupId'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      }
    ]
  };

  public tableData$!: Observable<TableDataModel<GroupModel>>;

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
        this.openInputModal(new GroupModel())
          .onHidden
          .pipe(
            tap((value: ModalActionModel<GroupModel>) => {
              if (value.action === ModalActionEnum.create) {
                this.store.dispatch(tableActions.createTableData({field: 'groups', item: value.data!}));
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

  public onControlAction(event: KeyValue<TableItemActionEnum, GroupModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal(event.value)
          .onHidden
          .pipe(
            tap((value: ModalActionModel<GroupModel>) => {
              if (value.action === ModalActionEnum.edit) {
                this.store.dispatch(tableActions.updateTableData({
                  field: 'groups',
                  item: value.data!
                }));
              }
            }),
            exhaustMap((value: ModalActionModel<GroupModel>) => {
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

  private deleteItem(event: KeyValue<TableItemActionEnum, GroupModel>): Observable<null> {
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
            return this.store.dispatch(tableActions.deleteTableData({field: 'groups', item: event.value}));
          }
        }),
        map(_ => null)
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('groups'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список груп',
            tableData: data as PaginationModel<GroupModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'groups'}));
  }

  private openInputModal(type?: GroupModel): BsModalRef {
    return this.modalService.show<InputModalComponent<GroupModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування групи',
            subheading: 'Уведіть/змініть дані',
            inputModel: new GroupModel(type),
            excludedFields: [...excludedFieldConfig, 'permissions'],
            fieldsOptions: null!,
            fieldTypes: new Map<keyof GroupModel, Partial<FieldInputModel<GroupModel>>>([
              [
                'name',
                {
                  isObligatory: true
                }
              ],
              [
                'parentGroupId',
                {
                  isObligatory: true,
                  type: InputTypeEnum.TypeHead,
                  targetSelectionFieldName: 'id',
                  selectData: this.tableData$.pipe(map(({tableData}) => tableData?.items)),
                  selectField: 'name'
                }
              ]
            ])
          }
        }
      }
    );
  }
}
