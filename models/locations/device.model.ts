import { TypeModel } from './type.model';
import { ReadingModel } from './reading.model';

export class DeviceModel {
  public id!: number;
  public serial!: string;
  public modelNumber!: string;
  public name!: string;
  public description!: string;
  public manufactureDate!: string;
  public secretKey!: string;
  public recognitionKey!: string;
  public deviceTypeId!: number;
  public roomId!: number;
  public readings!: ReadingModel[];
  public deviceType!: TypeModel;
  public deviceTypeName: string;

  constructor(device?: DeviceModel) {
    this.id = device?.id!;
    this.serial = device?.serial!;
    this.modelNumber = device?.modelNumber!;
    this.name = device?.name!;
    this.description = device?.description!;
    this.manufactureDate = device?.manufactureDate!;
    this.secretKey = device?.secretKey!;
    this.recognitionKey = device?.recognitionKey!;
    this.deviceTypeId = device?.deviceTypeId!;
    this.roomId = device?.roomId!;
    this.readings = device?.readings!;
    this.deviceType = device?.deviceType!;
    this.deviceTypeName = device?.deviceType?.name!;
  }
}
