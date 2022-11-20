import { DocumentModel } from './document.model';
import { AddDocumentationModel } from './add-documentation.model';

export class DocumentationModel extends DocumentModel {
  public order!: number;

  constructor(documentation?: DocumentationModel | AddDocumentationModel) {
    super(documentation as DocumentationModel);

    this.order = documentation?.order!;
  }
}
