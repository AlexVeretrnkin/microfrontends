import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { FieldInputModel, InputModalModel, InputTypeEnum } from '@models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportModalComponent<T> implements OnInit {
  @Input() public inputData!: InputModalModel<T>;

  public selectControl: FormControl = new FormControl('CSV');

  public readonly fieldOptions: FieldInputModel<T, string> = {
    type: InputTypeEnum.Select,
    selectData: of(['CSV', 'EXEL']),
    formControlName: 'Формат файлу' as keyof T,
    isObligatory: true
  };

  public fields!: string[];

  constructor(
    private modalRef: BsModalRef,
  ) { }

  public ngOnInit(): void {
    this.fields = Object.keys(this.inputData.inputModel);
  }

  public close(): void {
    this.modalRef.hide();
  }

  public action(): void {

  }
}
