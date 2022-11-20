import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  AddBuildingModel,
  AddUserModel, BuildingModel,
  ContactInfoChangesEnum,
  ContactInfoModel, DocumentationModel,
  InputTypeEnum,
  InvitedUserModel, ModalActionEnum, ModalActionModel, PaginationModel, QueryModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel,
  TableStateKeysType,
  TableStateModel,
  UserProfileModel, YesNoEnum
} from '@models';
import { Store } from '@ngrx/store';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { Observable, of } from 'rxjs';
import { exhaustMap, map, switchMap, take, tap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ExtendedInputModalComponent } from '@portal-shared';
import { excludedFieldConfig } from '@configs';
import { FormsService, ManageUsersService } from '@core';
import { FormArray } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { YesNoModalComponent } from '@shared';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageUsersComponent implements OnInit {
  @ViewChild('contactInfo') public contactInfo!: TemplateRef<null>;

  public readonly tableOptions: TableOptionsModel<UserProfileModel> = {
    expandableDataField: 'contactInfos',
    timeFields: ['created', 'updated'],
    excludedFields: [...excludedFieldConfig, 'permissions'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      }
    ],
    dataFields: new Map([
      ['photoUrl', TableDataFieldTypeEnum.photo],
      ['activated', TableDataFieldTypeEnum.boolean]
    ])
  };

  public tableData$!: Observable<TableDataModel<UserProfileModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private formsService: FormsService<ContactInfoModel>,
    private manageService: ManageUsersService
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();

    this.initContactsInfoForm();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.initContactsInfoForm();

        this.openInputModal()
          .onHidden
          .pipe(
            switchMap(({data}) => {

                return data?.firstName || data?.lastName || data?.photo
                  ? this.manageService.createUser({...data, contactInfos: this.contactInfoFormGroup.getRawValue()}) :
                  of(null!);
              }
            ),
            tap((invitedUser: InvitedUserModel) => invitedUser && this.fetchTableData()),
            take(1)
          )
          .subscribe();
        break;
    }
  }

  public onContactInfoChange(changes: KeyValue<ContactInfoChangesEnum, number>): void {
    switch (changes.key) {
      case ContactInfoChangesEnum.add:
        this.contactInfoFormGroup.push(this.formsService.getFormGroupFromModel(new ContactInfoModel()));
        break;
      case ContactInfoChangesEnum.remove:
        if (this.contactInfoFormGroup.controls.length > 1) {
          this.contactInfoFormGroup.removeAt(changes.value);
        }
        break;
    }
  }

  public onControlAction(event: KeyValue<TableItemActionEnum, AddUserModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.initContactsInfoForm(event.value?.contactInfos!);

        this.openInputModal({
            ...event.value,
            photo: event.value.photoUrl as string
          }
        )
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<AddUserModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.manageService.editUser({
                  id: event.value.id,
                  ...value.data!,
                  contactInfos: this.contactInfoFormGroup.getRawValue()
                });
              }

              if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event.value.id!);
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

  public onPagination(query: QueryModel<DocumentationModel>): void {
    this.store.dispatch(tableActions.initTableData({field: 'manageUsers', query: new QueryModel(query)}));
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
            return this.manageService.deleteUser(event);
          }

          return of(null!);
        })
      );
  }

  private initContactsInfoForm(info?: ContactInfoModel[]): void {
    if (!info) {
      this.contactInfoFormGroup = new FormArray([
        this.formsService.getFormGroupFromModel(new ContactInfoModel())
      ]);
    } else {
      this.contactInfoFormGroup = new FormArray([
        ...info.map(i => this.formsService.getFormGroupFromModel(new ContactInfoModel(i)))
      ]);
    }
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('manageUsers'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список користувачів',
            tableData: data as PaginationModel<UserProfileModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'manageUsers'}));
  }

  private openInputModal(user?: AddUserModel): BsModalRef {
    return this.modalService.show<ExtendedInputModalComponent<AddUserModel>>(
      ExtendedInputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування даних користувача',
            subheading: 'Уведіть/змініть дані користувача',
            inputModel: new AddUserModel(user),
            excludedFields: [...excludedFieldConfig, 'email', 'photoUrl', 'contactInfos'],
            additionalContent: this.contactInfo,
            fieldsOptions: new Map(
              [
                ['Загальні дані', [
                  {
                    formControlName: 'lastName',
                    icon: 'person-icon'
                  },
                  {
                    formControlName: 'firstName',
                    icon: 'person-icon'
                  },
                  {
                    formControlName: 'photo',
                    icon: 'file-icon',
                    type: InputTypeEnum.File
                  },
                ]]
              ]
            )
          }
        }
      }
    );
  }
}
