import { ReadingModel } from './reading.model';
import { ElectricityModel } from './electricity.model';
import { SnapshotModel } from './snapshot.model';
import { MeterTypeEnum } from './meter-type.enum';

export class MeterModel {
  public id?: number;
  public buildingId: number | string;
  public type: MeterTypeEnum;
  public serialNumber: number;
  public modelNumber: number;
  public number: number;
  public manufactureYear: number;
  public installationDate: number;
  public installationNotes: string;
  public accountingNumber: number;
  public relatedContractNumber: number;
  public lastVerificationDate: string;
  public responsibleUserId: number;
  public otherNotes: string;
  public verificationIntervalSec: number;
  public secretKey: string;
  public recognitionKey: string;
  public readings: ReadingModel[];
  public electricity: ElectricityModel;
  public snapshots: SnapshotModel[];

  constructor(meter?: MeterModel) {
    this.id = meter?.id!;
    this.buildingId = meter?.buildingId!;
    this.type = meter?.type!;
    this.serialNumber = meter?.serialNumber!;
    this.modelNumber = meter?.modelNumber!;
    this.number = meter?.number!;
    this.manufactureYear = meter?.manufactureYear!;
    this.installationDate = meter?.installationDate!;
    this.installationNotes = meter?.installationNotes!;
    this.accountingNumber = meter?.accountingNumber!;
    this.relatedContractNumber = meter?.relatedContractNumber!;
    this.lastVerificationDate = meter?.lastVerificationDate!;
    this.responsibleUserId = meter?.responsibleUserId!;
    this.otherNotes = meter?.otherNotes!;
    this.verificationIntervalSec = meter?.verificationIntervalSec!;
    this.secretKey = meter?.secretKey!;
    this.recognitionKey = meter?.recognitionKey!;
    this.readings = meter?.readings!;
    this.electricity = meter?.electricity!;
    this.snapshots = meter?.snapshots!;
  }
}
