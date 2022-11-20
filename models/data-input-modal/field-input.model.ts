import { ValidatorFn, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { InputTypeEnum } from './input-type.enum';

export class FieldInputModel<T, D = any> {
  public formControlName: keyof T;
  public type?: InputTypeEnum = InputTypeEnum.Text;
  public icon?: string;
  public placeholder?: string;
  public isObligatory?: boolean;
  public validators?: ValidatorFn[];
  public selectData?: Observable<D[]>;
  public selectField?: keyof D;
  public targetSelectionFieldName?: keyof D & string;


  constructor(formInput: FieldInputModel<T, D>) {
    this.formControlName = formInput.formControlName;
    this.type = formInput.type || InputTypeEnum.Text;
    this.icon = formInput.icon;
    this.placeholder = formInput.placeholder;
    this.isObligatory = formInput.isObligatory;
    this.selectData = formInput.selectData;
    this.selectField = formInput.selectField;
    this.targetSelectionFieldName = formInput.targetSelectionFieldName;
    this.validators = formInput?.validators!;
  }
}
