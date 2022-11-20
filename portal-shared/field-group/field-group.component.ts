import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KeyValue } from '@angular/common';

import { FieldGroupModel } from '@models';

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldGroupComponent<T> {
  @Input() public fieldGroup!: FieldGroupModel<T>;
  @Input() public modalFormGroup!: FormGroup;
  @Output() public typeheadSelection: EventEmitter<KeyValue<string, any>> = new EventEmitter<KeyValue<string, any>>();

  @Output() public fileChange: EventEmitter<KeyValue<string, File>> = new EventEmitter<KeyValue<string, File>>();

  public getFormControl(fromControlName: keyof T): FormControl {
    return this.modalFormGroup.get(fromControlName as string) as FormControl;
  }

  public onFileChange(fileMap: KeyValue<string, File>): void {
    this.fileChange.emit(fileMap);
  }

  public onTypeheadSelection(event: KeyValue<string, any>): void {
    this.typeheadSelection.emit(event);
  }
}
