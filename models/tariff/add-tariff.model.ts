import { MeterTypeEnum } from '../meters/meter-type.enum';

export class AddTariffModel {
  public id?: number;
  public type: MeterTypeEnum;
  public notes: string;
  public enactedSince: string;
  public commercialPrice: number;
  public reducedPrice: number;
  public residentialPrice: number;
  public file?: File | string;

  constructor(traffic?: AddTariffModel) {
    this.id = traffic?.id!;
    this.type = traffic?.type!;
    this.notes = traffic?.notes!;
    this.enactedSince = traffic?.enactedSince!;
    this.commercialPrice = +traffic?.commercialPrice!  || null!;
    this.reducedPrice = +traffic?.reducedPrice!  || null!;
    this.residentialPrice = +traffic?.residentialPrice!  || null!;
    this.file = traffic?.file!;
  }
}
