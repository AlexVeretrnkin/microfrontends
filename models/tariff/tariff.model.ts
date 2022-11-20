import { AddTariffModel } from './add-tariff.model';

export class TariffModel extends AddTariffModel {
  public fileSize: string;
  public fileName: string;
  public fileUrl: string;

  constructor(tariff?: TariffModel) {
    super(tariff);

    this.fileSize = tariff?.fileSize!;
    this.fileName = tariff?.fileName!;
    this.fileUrl = tariff?.fileUrl!;
  }
}
