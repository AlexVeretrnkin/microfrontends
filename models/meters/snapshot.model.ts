import { HeatMeterSnapshotModel } from './heat-meter-snapshot.model';
import { ElectricityMeterSnapshotModel } from './electricity-meter-snapshot.model';
import { MeterTypeEnum } from '../meters/meter-type.enum';
import { AddSnapshotModel } from './add-snapshot.model';

export class SnapshotModel extends AddSnapshotModel {
  public id?: number;
  public meterId?: number;
  public type?: MeterTypeEnum;
  public consumption?: number;
  public automatic?: boolean;
  public creationDate?: string;
  public currentTime?: string;
  public uptime?: number;
  public heatMeterSnapshot?: HeatMeterSnapshotModel;
  public electricityMeterSnapshot?: ElectricityMeterSnapshotModel;


  constructor(snapshot?: SnapshotModel) {
    super(snapshot);

    this.current = snapshot?.electricityMeterSnapshot?.current;
    this.voltage = snapshot?.electricityMeterSnapshot?.voltage;
    this.id = snapshot?.id;
    this.meterId = snapshot?.meterId;
    this.type = snapshot?.type;
    this.consumption = snapshot?.consumption;
    this.automatic = snapshot?.automatic;
    this.creationDate = snapshot?.creationDate && new Date(snapshot?.creationDate!).toISOString();
    this.currentTime = snapshot?.currentTime && new Date(snapshot?.currentTime!).toISOString();
    this.uptime = snapshot?.uptime;
    this.heatMeterSnapshot = snapshot?.heatMeterSnapshot;
    this.electricityMeterSnapshot = snapshot?.electricityMeterSnapshot;
  }
}
