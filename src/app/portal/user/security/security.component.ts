import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChangePasswordModel, InputTypeEnum, ModalActionModel, SessionInfoModel, TableDataModel } from '@models';
import { UserProfileService } from '@core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InputModalComponent } from '@portal-shared';
import { excludedFieldConfig } from '@configs';
import { FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '@base-core';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityComponent implements OnInit {
  public sessions: SessionInfoModel[] = [
    {
      authorizationType: 'Пароль',
      startDate: '23.04.2021 12:04:15',
      lastActivityDate: '16.03.2021 15:00:23',
    },
    {
      authorizationType: 'Фізичний ключ “OTK1”',
      startDate: '23.04.2021 12:04:15',
      lastActivityDate: '16.03.2021 15:00:23',
    },
    {
      authorizationType: 'Фізичний ключ “OTK1”',
      startDate: '23.04.2021 12:04:15',
      lastActivityDate: '16.03.2021 15:00:23',
    },
    {
      authorizationType: 'Пароль',
      startDate: '23.04.2021 12:04:15',
      lastActivityDate: '16.03.2021 15:00:23',
    }
  ];

  public test: TableDataModel<SessionInfoModel> = {
    heading: 'Активні сесії',
    tableData: null!
  };

  constructor(
    private userProfileService: UserProfileService,
    private modalService: BsModalService,
    private validatorService: ValidatorService,
  ) { }

  public ngOnInit(): void {
  }

  public changePassword(): void {
    const modalRef: BsModalRef<InputModalComponent<ChangePasswordModel>> = this.openInputModal();

    const formGroup: FormGroup = modalRef.content?.modalFormGroup!;

    formGroup.get('repeatPassword')?.setValidators([
      Validators.required, this.validatorService.repeatPasswordValidator(formGroup.get('newPassword')!)
    ]);

    modalRef
      .onHidden
      .pipe(
        switchMap((modalData: ModalActionModel<ChangePasswordModel>) => {
          if (modalData.data) {
            return this.userProfileService.changePassword(modalData.data.oldPassword, modalData.data.newPassword);
          }

          return of(null!);
        }),
        take(1)
      )
      .subscribe();
  }

  private openInputModal(): BsModalRef {
    return this.modalService.show<InputModalComponent<ChangePasswordModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Зміна паролю',
            subheading: 'Уведіть дані для зміни паролю',
            actionButtonText: 'Підтвердити',
            inputModel: new ChangePasswordModel(),
            excludedFields: [...excludedFieldConfig, '', 'buildingsCount'],
            fieldsOptions: null!,
            fieldTypes: new Map([
                [
                  'oldPassword',
                  {
                    isObligatory: true,
                    type: InputTypeEnum.Password,
                    icon: 'password-icon'
                  }
                ],
              [
                'newPassword',
                {
                  isObligatory: true,
                  type: InputTypeEnum.Password,
                  icon: 'password-icon'
                }
              ],
              [
                'repeatPassword',
                {
                  isObligatory: true,
                  type: InputTypeEnum.Password,
                  icon: 'password-icon'
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
