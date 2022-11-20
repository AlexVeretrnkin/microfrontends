import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TableDataFieldTypeEnum, TableItemActionEnum, TableOptionsModel } from '@models';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-basic-table-item',
  templateUrl: './basic-table-item.component.html',
  styleUrls: [
    '../basic-table.component.scss',
    './basic-table-item.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTableItemComponent<T> {
  @Input() public index!: number;

  @Input() public itemOptions!: TableOptionsModel<T>;

  @Input() public data!: T;

  @Output() public itemCopy: EventEmitter<string> = new EventEmitter<string>();

  @Input() public isControlsDisabled = false;

  @Output() public controlAction: EventEmitter<KeyValue<TableItemActionEnum, T>> =
    new EventEmitter<KeyValue<TableItemActionEnum, T>>();

  @Output() public itemAction: EventEmitter<KeyValue<TableDataFieldTypeEnum, string>> =
    new EventEmitter<KeyValue<TableDataFieldTypeEnum, string>>();

  public readonly fieldTypeEnum: typeof TableDataFieldTypeEnum = TableDataFieldTypeEnum;

  public isOpen!: boolean;

  public open(): void {
    this.isOpen = !this.isOpen;
  }

  public copyAction(value: string): void {
    this.itemCopy.emit(value);
  }

  public getFieldType(field: keyof T): TableDataFieldTypeEnum {
    return this.itemOptions.dataFields?.get(field)!;
  }

  public getFieldValue(field: string | keyof T): string {
    return this.data[field as keyof T] as unknown as string;
  }

  public action(field: keyof T): void {
    if (this.getFieldType(field) === TableDataFieldTypeEnum.coordinates) {
      this.itemAction.emit({
        key: TableDataFieldTypeEnum.coordinates,
        value: this.getFieldValue(field)
      });
    }
  }

  public emitControlAction(type: TableItemActionEnum): void {
    this.controlAction.emit({
      key: type,
      value: this.data
    });
  }
}
