import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AddUserModel,
  ContactInfoChangesEnum,
  ContactInfoModel,
  InputTypeEnum,
  InvitedUserModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableStateModel,
  TableOptionsModel,
  TableStateKeysType, TableItemActionEnum, ModalActionModel, ModalActionEnum, YesNoEnum, PaginationModel,
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsService, ManageUsersService } from '@core';
import { exhaustMap, map, switchMap, take, tap } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { ExtendedInputModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';

@Component({
  selector: 'app-manage-invites',
  templateUrl: './manage-invites.component.html',
  styleUrls: ['./manage-invites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageInvitesComponent implements OnInit {
  @ViewChild('contactInfo') public contactInfo!: TemplateRef<null>;

  public readonly tableOptions: TableOptionsModel<InvitedUserModel> = {
    expandableDataField: 'inviter',
    excludedFields: [...excludedFieldConfig, 'invitee', 'inviter', 'secretKey', 'permissions'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.edit,
      }
    ],
    dataFields: new Map([
      ['expirationDate', TableDataFieldTypeEnum.date],
      ['inviteLink', TableDataFieldTypeEnum.copy]
    ])
  };

  public tableData$!: Observable<TableDataModel<InvitedUserModel>>;

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
        this.openInputModal()
          .onHidden
          .pipe(
            switchMap((modalEvent) => {
                return !!modalEvent.data
                  ? this.manageService.createUser({...modalEvent.data, contactInfos: this.contactInfoFormGroup.getRawValue()}) :
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

  public onControlAction(event: KeyValue<TableItemActionEnum, InvitedUserModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:

        this.openInputModal(new AddUserModel({
          id: event.value.invitee.id!,
          firstName: event.value.invitee.firstName!,
          lastName: event.value.invitee.lastName!,
        } as AddUserModel))
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<AddUserModel>) => {
              if (value.action === ModalActionEnum.edit) {
                return this.manageService.editUser(value.data!);
              }

              if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event.value.invitee.id!);
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
        this.deleteItem(event.value.invitee.id!)
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );
        break;
    }
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

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('invitedUsers'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список запрошень',
            tableData: data as PaginationModel<InvitedUserModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'invitedUsers'}));
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
