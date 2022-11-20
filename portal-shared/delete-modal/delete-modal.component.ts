import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeleteDataModalModel, YesNoEnum } from '@models';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteModalComponent {
  public data!: DeleteDataModalModel;

  public userInput!: string;

  public readonly yesNoEnum: typeof YesNoEnum = YesNoEnum;

  constructor(
    private modalRef: BsModalRef
  ) { }

  public onUserAction(actionType: YesNoEnum): void {
    this.modalRef.onHidden.emit(actionType);

    this.modalRef.hide();
  }
}
