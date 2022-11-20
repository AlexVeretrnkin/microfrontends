import { TableOptionsModel } from './table-options.model';

export class TableItemDataModel<T> extends TableOptionsModel<T>{
  public data!: T;
  public index!: number;
}
