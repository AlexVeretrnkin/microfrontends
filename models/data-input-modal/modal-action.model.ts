import { ModalActionEnum } from './modal-action.enum';

export class ModalActionModel<T> {
  public action!: ModalActionEnum;
  public data?: T;
}
