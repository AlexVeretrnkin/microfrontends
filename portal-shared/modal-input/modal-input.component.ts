import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KeyValue } from '@angular/common';

import { FieldInputModel, InputTypeEnum } from '@models';

@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalInputComponent<T> {
  @Input() public inputData!: FieldInputModel<T>;
  @Input() public control!: FormControl;
  @Input() public translation = '';

  @Output() public fileChange: EventEmitter<KeyValue<string, File>> = new EventEmitter<KeyValue<string, File>>();
  @Output() public coordinatesChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() public typeheadSelection: EventEmitter<KeyValue<string, any>> = new EventEmitter<KeyValue<string, any>>();

  public readonly inputType: typeof InputTypeEnum = InputTypeEnum;

  private readonly fileIndex: number = 2;

  public get fileFieldValue(): string {
    return this.control.value.split('\\')[this.fileIndex];
  }

  public get getFieldName(): string {
    return this.inputData.formControlName as string;
  }

  public getString(value: any): string {
    return value as string;
  }

  public emitFileChange(event: Event): void {
    const file: FileList = (event.target as HTMLInputElement & EventTarget).files!;

    if (file) {
      this.control.setValue(file[0].name);

      this.fileChange.emit(
        {
          key: this.inputData.formControlName as string,
          value: file[0]
        }
      );
    }
  }

  public emitAction(): void {
    if (this.inputData.type === InputTypeEnum.Coordinates) {
      this.coordinatesChange.emit();

      this.control.setErrors(null);
    }

    if (this.inputData.type === InputTypeEnum.File && !this.control.value && this.inputData.isObligatory) {
      this.control.setErrors({required: true});

      this.control.markAllAsTouched();
    }
  }

  public onTypeheadSelection(event: KeyValue<string, any>): void {
    this.typeheadSelection.emit(event);
  }

  public clearControl(): void {
    this.control.setValue(null);
    this.control.updateValueAndValidity();
  }
}
