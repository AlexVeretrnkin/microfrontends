import { ElectricityMeterSnapshotModel } from './electricity-meter-snapshot.model';

export class AddSnapshotModel {
  public consumption?: number;
  public creationDate?: string;
  public currentTime?: string;
  public voltage?: number;
  public current?: number;
  public electricity?: ElectricityMeterSnapshotModel;

  constructor(addSnapshot?: AddSnapshotModel) {
    this.consumption = addSnapshot?.consumption;
    this.creationDate = addSnapshot?.creationDate;
    this.currentTime = addSnapshot?.currentTime;
    this.voltage = addSnapshot?.voltage;
    this.current = addSnapshot?.current;
  }
}
