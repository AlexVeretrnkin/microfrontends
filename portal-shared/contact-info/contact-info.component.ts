import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

import { ContactInfoChangesEnum, ContactInfoModel, ContactTypeEnum, FieldInputModel } from '@models';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent {
  @Input() public formData!: FormArray;

  @Output() public contactInfoChanges: EventEmitter<KeyValue<ContactInfoChangesEnum, number>> =
    new EventEmitter<KeyValue<ContactInfoChangesEnum, number>>();

  public readonly contactInfoChangesEnum: typeof ContactInfoChangesEnum = ContactInfoChangesEnum;

  public readonly contactTypes: ContactTypeEnum[] = Object.values(ContactTypeEnum);

  public getFormControl(formGroup: AbstractControl, name: string): FormControl {
    return formGroup.get(name) as FormControl;
  }

  public getInputData(name: keyof ContactInfoModel): FieldInputModel<ContactInfoModel> {
    return {
      formControlName: name,
      isObligatory: true
    };
  }

  public choseContactType(type: ContactTypeEnum, abstractControl: AbstractControl): void {
    (abstractControl as FormGroup).patchValue({type});
  }

  public changeContactInfo(changes: ContactInfoChangesEnum, index?: number): void {
    this.contactInfoChanges.emit({
      key: changes,
      value: index!
    });
  }
}
