import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AddUserToGroupModel,
  FieldInputModel,
  InputTypeEnum,
  ModalActionEnum,
  ModalActionModel,
  PaginationModel,
  QueryModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel,
  TableStateKeysType,
  TableStateModel,
  UserProfileModel,
  UserRoleInGroupEnum,
  YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GroupsService } from '@core';
import { ActivatedRoute } from '@angular/router';
import { RoutesEnum } from '../../../../../routes.enum';
import { map, pluck, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class GroupMembersComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<UserProfileModel> = {
    excludedFields: [...excludedFieldConfig, 'permissions', 'activated', 'contactInfos'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.delete,
        classes: 'bg-error-lightest'
      }
    ],
    dataFields: new Map([
      ['photoUrl', TableDataFieldTypeEnum.photo]
    ])
  };

  public tableData$!: Observable<TableDataModel<UserProfileModel>>;

  public contactInfoFormGroup!: FormArray;

  private query: QueryModel<UserProfileModel> = new QueryModel<UserProfileModel>();

  private groupId!: number;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private groupsService: GroupsService
  ) {
  }

  public ngOnInit(): void {
    this.groupId = +this.activatedRoute.snapshot.parent!.paramMap.get(RoutesEnum.manageGroupId)!;

    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      // @ts-ignore
      user_group_id: this.groupId
    };

    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal()
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<AddUserToGroupModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.groupsService.addUserToGroup(value.data!, this.groupId);
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

  public onControlAction(event: KeyValue<TableItemActionEnum, UserProfileModel>): void {
    switch (event.key) {
      case TableItemActionEnum.delete:
        this.deleteItem(event)
          .pipe(
            take(1),
            untilDestroyed(this)
          )
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );
        break;
    }
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, UserProfileModel>): Observable<null> {
    return this.modalService.show(YesNoModalComponent, {
      initialState: {
        data: {
          subtitle: 'Користувача буде видалено з групи',
          title: 'Ви впевнені?'
        }
      }
    }).onHidden
      .pipe(
        switchMap((value: YesNoEnum) => {
          if (value === YesNoEnum.accept) {
            return this.groupsService.removeUserFromGroup(this.groupId, event.value.id!);
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('usersInGroup'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список членів групи',
            tableData: data as PaginationModel<UserProfileModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'usersInGroup', query: this.query}));
  }

  private openInputModal(type?: AddUserToGroupModel): BsModalRef {
    this.store.dispatch(tableActions.initTableData({field: 'manageUsers'}));

    return this.modalService.show<InputModalComponent<AddUserToGroupModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Додавання користувача до групи',
            subheading: 'Уведіть дані',
            inputModel: new AddUserToGroupModel(type),
            excludedFields: [...excludedFieldConfig],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    );
  }

  private getFieldTypes(): Map<keyof AddUserToGroupModel, Partial<FieldInputModel<AddUserToGroupModel>>> {
    const result: Map<keyof AddUserToGroupModel, Partial<FieldInputModel<AddUserToGroupModel>>> =
      new Map<keyof AddUserToGroupModel, Partial<FieldInputModel<AddUserToGroupModel>>>();

    result.set('userRole', {
      isObligatory: true,
      type: InputTypeEnum.Select,
      selectData: of(Object.values(UserRoleInGroupEnum))
    });

    result.set('userId', {
      isObligatory: true,
      type: InputTypeEnum.TypeHead,
      selectData: this.store.select(selectTable('manageUsers')).pipe(pluck('items')) as Observable<UserProfileModel[]>,
      selectField: 'lastName',
      targetSelectionFieldName: 'id'
    });

    return result;
  }
}
