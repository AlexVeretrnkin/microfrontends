import { TemplateRef } from '@angular/core';
import { InputModalModel } from './input-modal.model';

export class ExtendedModalModel<T, C = null> extends InputModalModel<T> {
  public additionalContent?: TemplateRef<C>;

  constructor(modalOptions: ExtendedModalModel<T, C>) {
    super(modalOptions);

    this.additionalContent = modalOptions.additionalContent;
  }
}
