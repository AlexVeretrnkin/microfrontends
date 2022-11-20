import { FieldInputModel } from '@models';

export class InputModalModel<T> {
  public heading!: string;
  public subheading!: string;
  public actionButtonText?: string;
  public inputModel!: T;
  public fieldsOptions?: Map<string, Partial<FieldInputModel<T>>[]>;
  public fieldTypes?: Map<keyof T, Partial<FieldInputModel<T>>>;
  public excludedFields?: Array<keyof T>;
  public translation?: string;

  constructor(modalOptions: InputModalModel<T>) {
    this.heading = modalOptions.heading;
    this.subheading = modalOptions.subheading;
    this.inputModel = modalOptions.inputModel;
    this.fieldsOptions = modalOptions.fieldsOptions;
    this.excludedFields = modalOptions.excludedFields;
    this.actionButtonText = modalOptions.actionButtonText;
    this.translation = modalOptions?.translation;
  }
}
