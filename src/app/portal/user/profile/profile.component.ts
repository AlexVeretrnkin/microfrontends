import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { combineLatest, Observable, of } from 'rxjs';

import { AuthService } from '@base-core';

import { ContactInfoModel, ContactTypeEnum, StoreModel, UserProfileModel } from '@models';
import { userProfileActions } from '@actions';
import { switchMap, take, tap } from 'rxjs/operators';
import { FormsService, UserProfileService } from '@core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  public userProfile$!: Observable<UserProfileModel>;

  public userFormGroup!: FormGroup;

  public isEditDisabled = true;

  public contactInfoFormGroup!: FormArray;

  public chosenPhotoUrl!: string;

  public readonly contactTypes: ContactTypeEnum[] = Object.values(ContactTypeEnum);

  private file!: File;

  private contactsIdToRemove: number[] = [];

  constructor(
    private authService: AuthService,
    private store: Store<StoreModel>,
    private formBuilder: FormBuilder,
    private formsService: FormsService<ContactInfoModel>,
    private userProfileService: UserProfileService
  ) {
  }

  public ngOnInit(): void {
    this.initUserProfile();

    this.initForm();
  }

  public logOut(): void {
    this.authService.logOut();
  }

  public edit(user: UserProfileModel): void {
    if (this.isEditDisabled) {
      this.userFormGroup.enable();
      this.contactInfoFormGroup.controls.forEach(c => c.enable());
    } else {
      this.userFormGroup.disable();
      this.contactInfoFormGroup.controls.forEach(c => c.disable());

      this.userProfileService.updateUserInfo({
        ...user,
        ...this.userFormGroup.getRawValue(),
        contactInfos: this.contactInfoFormGroup.getRawValue()
      })
        .pipe(
          switchMap(userInfo => {
            if (this.file) {
              return this.userProfileService.updateUserPhoto(user.id!, this.file);
            }

            return of(userInfo!);
          }),
          switchMap(_ => this.contactsIdToRemove.length ?
            this.userProfileService.deleteContacts(this.contactsIdToRemove) :
            of(null)
          ),
          take(1)
        )
        .subscribe(
          _ => this.store.dispatch(userProfileActions.getUserProfile(null!)),
          _ => this.store.dispatch(userProfileActions.getUserProfile(null!))
        );
    }

    this.isEditDisabled = !this.isEditDisabled;
  }

  public getFormControl(group: AbstractControl, name: string): FormControl {
    return group.get(name) as FormControl;
  }

  public onFileChange(event: Event): void {
    this.file = (event.target as HTMLInputElement & EventTarget).files![0];

    this.chosenPhotoUrl = URL.createObjectURL(this.file).valueOf();
  }

  public addContact(): void {
    this.contactInfoFormGroup.push(this.formsService.getFormGroupFromModel(new ContactInfoModel()));
  }

  private initUserProfile(): void {
    this.store.dispatch(userProfileActions.getUserProfile());

    this.userProfile$ = this.store.select('userProfile')
      .pipe(
        tap((userProfile: UserProfileModel) => {
          this.userFormGroup.patchValue(userProfile);

          this.initContactsInfoForm(userProfile?.contactInfos);
        })
      );
  }

  private initForm(): void {
    this.userFormGroup = this.formBuilder.group({
      firstName: new FormControl({value: null, disabled: this.isEditDisabled}, Validators.required),
      lastName: new FormControl({value: null, disabled: this.isEditDisabled}, Validators.required),
      notes: new FormControl({
        value: 'Студент 4 курсу ТЕФ\n' +
          'НТУУ “КПІ”\n' +
          'ІМ. ІГОРЯ СІКОРСЬКОГО', disabled: this.isEditDisabled
      })
    });
  }

  private initContactsInfoForm(contacts: ContactInfoModel[]): void {
    if (contacts) {
      this.contactInfoFormGroup = new FormArray(
        contacts.map(contact => this.formsService.getFormGroupFromModel(new ContactInfoModel(contact)))
      );

      this.contactInfoFormGroup.controls.forEach(c => c.disable());
    }
  }

  public deleteContact(contactIndex: number): void {
    this.contactsIdToRemove.push(this.contactInfoFormGroup.at(contactIndex).get('id')?.value);

    this.contactInfoFormGroup.removeAt(contactIndex);
  }
}
