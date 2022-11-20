import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'formErrors'
})
export class FormErrorsPipe implements PipeTransform {
  private readonly errorsFieldName: string = 'errors';

  constructor(
    private translatePipe: TranslatePipe,
    private translateService: TranslateService,
  ) {
  }

  public transform(value: ValidationErrors, translationRootName: string, backEndErrors?: ValidationErrors): string {
    const translation = `${translationRootName}.${this.errorsFieldName}.${this.getFirstErrorKey(value)}`;

    return this.translatePipe.transform(translation);
  }

  private getFirstErrorKey(errors: ValidationErrors): string {
    const errorKeys: string[] = Object.keys(errors);

    return errorKeys?.length ? errorKeys[0] : '';
  }
}
