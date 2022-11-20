import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { YesNoEnum, YseNoDataModel } from '@models';

@Component({
  selector: 'app-yes-no-modal',
  templateUrl: './yes-no-modal.component.html',
  styleUrls: ['./yes-no-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YesNoModalComponent {
  public data!: YseNoDataModel;

  public readonly yesNoEnum: typeof YesNoEnum = YesNoEnum;

  constructor(
    private modalRef: BsModalRef
  ) { }

  public onUserAction(actionType: YesNoEnum): void {
    this.modalRef.onHidden.emit(actionType);

    this.modalRef.hide();
  }
}
