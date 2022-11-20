import { AddDocumentModel } from './add-document.model';

export class AddDocumentationModel extends AddDocumentModel {
  public order!: number;

  constructor(documentation?: AddDocumentationModel) {
    super(documentation);

    this.order = documentation?.order!;
  }
}
