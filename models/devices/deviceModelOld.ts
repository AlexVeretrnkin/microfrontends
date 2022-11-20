import { ReadingModelOld } from './readingModelOld';

export class DeviceModelOld {
  public id!: string;
  public serial!: string;
  public modelNumber!: string;
  public name!: string;
  public description!: string;
  public manufactureDate!: string;
  public type?: string;
  public roomId!: string;
  public readings!: ReadingModelOld;
}
