import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { FieldGroupModel, FieldInputModel, FormControlConfigModel } from '@models';

@Injectable()
export class FormsService<T> {

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public getFieldGroupFromModel(
    fieldOptions: Map<string | keyof T, Partial<FieldInputModel<T>>[]>, model: T, excludedFields: string[]
  ): FieldGroupModel<T>[] {
    return this.generateFieldGroup(fieldOptions as Map<string, Partial<FieldInputModel<T>>[]>, model, excludedFields);
  }

  public getInputFields(
    fieldOptions: Map<keyof T, Partial<FieldInputModel<T>>>,
    model: T, excludedFields: string[]
  ): FieldInputModel<T>[] {
    return Object.keys(model)
      .filter((key: string) => !excludedFields.includes(key))
      .map((key: string) => new FieldInputModel<T>(
        {
          formControlName: key as keyof T,
          ...fieldOptions.get(key as keyof T)
        }
      ));
  }

  public getFormGroupFromModel(model: T, excludedFields?: string[], fieldOptions?: Map<keyof T, Partial<FieldInputModel<T>>>): FormGroup {
    return this.formBuilder.group(
      this.getFormControlsConfig(model, excludedFields, fieldOptions)
    );
  }

  public getFormControlsConfig(
    model: T,
    excludedFields?: string[],
    fieldOptions?: Map<keyof T, Partial<FieldInputModel<T>>>
  ): FormControlConfigModel {
    const config: FormControlConfigModel = {};

    Object.keys(model).forEach((key: string) => {
      if (!excludedFields || !excludedFields?.includes(key)) {
        const passedValidators: ValidatorFn[] | undefined = fieldOptions?.get(key as keyof T)?.validators;
        const validators: ValidatorFn[] = [];

        if (passedValidators) {
          validators.push(...passedValidators);
        }

        if (fieldOptions?.get(key as keyof T)?.isObligatory) {
          validators.push(Validators.required);
        }

        config[key] = new FormControl(model[key as keyof T], validators);
      }
    });

    return config;
  }

  private generateFieldGroup(
    fieldOptions: Map<string, Partial<FieldInputModel<T>>[]>, model: T, excludedFields: string[]
  ): FieldGroupModel<T>[] {
    const fieldGroupArray: FieldGroupModel<T>[] = [];

    [...fieldOptions.keys()].forEach((fieldGroupName: string) => {
      fieldGroupArray.push({
        name: fieldGroupName,
        inputs: this.getFieldInputsFromMap(fieldOptions, fieldGroupName, model, excludedFields)
      });
    });

    return fieldGroupArray;
  }

  private getFieldInputsFromMap(
    fieldOptions: Map<string, Partial<FieldInputModel<T>>[]>, fieldGroupName: string, model: T, excludedFields: string[]
  ): FieldInputModel<T>[] {
    return fieldOptions.get(fieldGroupName) as FieldInputModel<T>[];
  }
}
