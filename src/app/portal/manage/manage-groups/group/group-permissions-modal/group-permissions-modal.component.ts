import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PermissionsEnum } from '@models';

@Component({
  selector: 'app-group-permissions-modal',
  templateUrl: './group-permissions-modal.component.html',
  styleUrls: ['./group-permissions-modal.component.scss']
})
export class GroupPermissionsModalComponent implements OnInit {
  @Input() public parentPermissions!: PermissionsEnum[];
  @Input() public ownPermissions!: PermissionsEnum[];

  public modalFormGroup!: FormGroup;

  constructor(
    private modalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.modalFormGroup = this.formBuilder.group({
      permissions: new FormArray(
        this.parentPermissions.map((permission: PermissionsEnum) => new FormControl(this.ownPermissions.includes(permission)))
      )
    });
  }

  public getFormControlFromArray(idx: number): FormControl {
    return (this.modalFormGroup.get('permissions') as FormArray).at(idx) as FormControl;
  }

  public close(): void {
    this.modalRef.hide();
  }

  public action(): void {
    const permissions: PermissionsEnum[] = [];

    (this.modalFormGroup.get('permissions') as FormArray).getRawValue().forEach((item: boolean, idx: number) => {
      if (item) {
        permissions.push(this.parentPermissions[idx]);
      }
    });

    this.modalRef.onHidden.emit(permissions);

    this.close();
  }

}
