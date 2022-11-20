import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ExtendedModalModel, FieldGroupModel, ModalActionEnum, ModalActionModel } from '@models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { FormsService } from '@core';
import { act } from '@ngrx/effects';

@Component({
  selector: 'app-extended-input-modal',
  templateUrl: './extended-input-modal.component.html',
  styleUrls: ['./extended-input-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtendedInputModalComponent<T> implements OnInit {
  @Input() public inputData!: ExtendedModalModel<T>;

  public modalFormGroup!: FormGroup;

  public fieldGroups: FieldGroupModel<T>[] = [];

  public readonly actionTypes: typeof ModalActionEnum = ModalActionEnum;

  public get isDeleteButtonShown(): boolean {
    return Object.values(this.inputData.inputModel).some(v => !!v);
  }

  private selectionsMap: Map<string, any> = new Map<string, any>();

  private filesMap: Map<string, File> = new Map<string, File>();

  constructor(
    private modalRef: BsModalRef,
    private formsService: FormsService<T>
  ) { }

  public ngOnInit(): void {
    this.modalFormGroup = this.formsService.getFormGroupFromModel(
      this.inputData.inputModel,
      this.inputData.excludedFields as string[],
      this.inputData.fieldTypes
    );

    this.fieldGroups = this.formsService.getFieldGroupFromModel(
      this.inputData.fieldsOptions!,
      this.inputData.inputModel,
      this.inputData.excludedFields as string[]
    );
  }

  public close(): void {
    this.modalRef.hide();
  }

  public action(modalAction: ModalActionEnum = ModalActionEnum.create): void {
    const files: {[key: string]: File} = {};
    const selections: {[key: string]: any} = {};

    if (this.isDeleteButtonShown && modalAction !== ModalActionEnum.delete) {
      modalAction = ModalActionEnum.edit;
    }

    [...this.filesMap.keys()].forEach((key: string) => {
      files[key] = this.filesMap.get(key)!;
    });

    [...this.selectionsMap.keys()].forEach((key: string) => {
      selections[key] = this.selectionsMap.get(key)!;
    });

    const action: ModalActionModel<T> = {
      action: modalAction,
      data: {
        ...this.inputData.inputModel,
        ...this.modalFormGroup.getRawValue(),
        ...files,
        ...selections
      }
    };

    this.modalRef.onHidden.emit({
      ...action
    });

    this.close();
  }

  public onFileChange(fileMap: KeyValue<string, File>): void {
    this.filesMap.set(fileMap.key, fileMap.value);
  }

  public onTypeheadSelection(event: KeyValue<string, any>): void {
    this.selectionsMap.set(event.key, event.value);
  }
}
