import { AddDocumentModel } from './add-document.model';

export class DocumentModel extends AddDocumentModel {
  public id: number;
  public created: string;
  public updated: string;
  public fileSize: string;
  public fileName: string;
  public fileUrl: string;

  constructor(document?: DocumentModel) {
    super(document);

    this.id = document?.id!;
    this.created = document?.created!;
    this.updated = document?.updated!;
    this.fileSize = document?.fileSize!;
    this.fileName = document?.fileName!;
    this.fileUrl = document?.fileUrl!;

    delete this.file;
  }
}
