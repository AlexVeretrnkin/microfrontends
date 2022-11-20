import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CoordinatesModel, FieldInputModel, InputModalModel, ModalActionEnum, ModalActionModel } from '@models';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsService } from '@core';
import { KeyValue } from '@angular/common';
import { MapPickerModalComponent } from '../map-picker/map-picker-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputModalComponent<T> implements OnInit {
  @Input() public inputData!: InputModalModel<T>;

  public modalFormGroup!: FormGroup;

  public fieldInputs: FieldInputModel<T>[] = [];

  public readonly actionTypes: typeof ModalActionEnum = ModalActionEnum;

  private filesMap: Map<string, File> = new Map<string, File>();

  private selectionsMap: Map<string, any> = new Map<string, any>();

  public get isDeleteButtonShown(): boolean {
    return Object.values(this.inputData.inputModel).some(v => !!v);
  }

  constructor(
    private modalRef: BsModalRef,
    private formsService: FormsService<T>,
    private modalService: BsModalService
  ) { }

  public ngOnInit(): void {
    this.modalFormGroup = this.formsService.getFormGroupFromModel(
      this.inputData.inputModel,
      this.inputData.excludedFields as string[],
      this.inputData.fieldTypes
    );

    this.fieldInputs = this.formsService.getInputFields(
      this.inputData.fieldTypes!,
      this.inputData.inputModel,
      this.inputData.excludedFields as string[]
    );
  }

  public getFormControl(fromControlName: keyof T): FormControl {
    return this.modalFormGroup.get(fromControlName as string) as FormControl;
  }

  public close(): void {
    this.modalRef.hide();
  }

  public action(modalAction: ModalActionEnum = ModalActionEnum.create): void {
    const files: {[key: string]: File} = {};
    const selections: {[key: string]: any} = {};

    if (this.inputData.inputModel[this.fieldInputs[0].formControlName] && modalAction !== ModalActionEnum.delete) {
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
        ...this.getCoordinates(),
        ...files,
        ...selections
      }
    };

    this.modalRef.onHidden.emit(action);

    this.close();
  }

  public onFileChange(fileMap: KeyValue<string, File>): void {
    this.filesMap.set(fileMap.key, fileMap.value);
  }

  public onCoordinatesChange(): void {
    this.modalService.show(MapPickerModalComponent, {
      initialState: {
        coordinates: this.getCoordinates()
      }
    })
      .onHidden
      .pipe(take(1))
      .subscribe((data: CoordinatesModel) => {
        if (data.coordinates) {
          this.modalFormGroup.get('coordinates')?.setValue(data.coordinates);
        }
      });
  }

  private getCoordinates(): CoordinatesModel {
    const coordinates: string = this.modalFormGroup.get('coordinates')?.value;

    if (coordinates) {
      const [latitude, longitude]: string[] = coordinates.split(' ');

      return {
        coordinates: coordinates!,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    return {} as CoordinatesModel;
  }

  public onTypeheadSelection(event: KeyValue<string, any>): void {
    this.selectionsMap.set(event.key, event.value);
  }
}
