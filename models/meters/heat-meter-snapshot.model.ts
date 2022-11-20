export class HeatMeterSnapshotModel {
  public id?: number;
  public snapshotId?: number;
  public incomingTemperature?: number;
  public outgoingTemperature?: number;
  public incomingPumpUsage?: number;
  public outgoingPumpUsage?: number;
  public outsideTemperature?: number;
  public insideTemperature?: number;
  public incomingWaterPressure?: number;
  public outgoingWaterPressure?: number;
  public heatConsumption?: number;
}
