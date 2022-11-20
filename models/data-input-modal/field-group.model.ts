import { FieldInputModel } from './field-input.model';

export class FieldGroupModel<T> {
  public name!: string;
  public inputs!: FieldInputModel<T>[];
}
