import { Injectable } from '@angular/core';
import { TableDataFieldTypeEnum, TableOptionsModel } from '@models';

@Injectable()
export class TableService<T> {
  constructor() { }

  public getDataFieldMap(model: T, options: TableOptionsModel<T>): Map<keyof T, TableDataFieldTypeEnum> {
    const dataFields = this.getDataFields(model, options);

    const fieldsMap: Map<keyof T, TableDataFieldTypeEnum> = new Map<keyof T, TableDataFieldTypeEnum>();

    dataFields.forEach((field: keyof T) => {
      fieldsMap.set(
        field, options.dataFields?.get(field) ?? TableDataFieldTypeEnum.text
      );
    });

    return fieldsMap;
  }

  private getDataFields(model: T, options: TableOptionsModel<T>): Array<keyof T> {
    return Object.keys(model).filter(
      (item: string) =>
        item !== options.expandableDataField &&
        !options.excludedFields?.includes(item as keyof T)
    ) as [keyof T];
  }
}
