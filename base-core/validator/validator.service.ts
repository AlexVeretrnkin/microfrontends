import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable()
export class ValidatorService {
  public repeatPasswordValidator(passwordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isPasswordsTheSame: boolean = passwordControl.value === control.value;

      return isPasswordsTheSame ? null : {repeatPassword: true};
    };
  }
}
