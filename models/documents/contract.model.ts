import { DocumentModel } from './document.model';

export class ContractModel extends DocumentModel {
  public number: number;
  public type: string;
  public notes: string;
  public startDate: string;
  public expirationDate: string;


  constructor(contract?: ContractModel) {
    super(contract);

    this.number = contract?.number!;
    this.startDate = contract?.startDate!;
    this.expirationDate = contract?.expirationDate!;
    this.type = contract?.type!;
    this.file = contract?.file;
    this.notes = contract?.notes!;
  }
}
