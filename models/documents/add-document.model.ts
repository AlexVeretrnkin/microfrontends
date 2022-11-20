export class AddDocumentModel {
  public name: string;
  public type: string;
  public file?: File | string;

  constructor(document?: AddDocumentModel) {
    this.name = document?.name!;
    this.type = document?.type!;
    this.file = document?.file!;
  }
}
