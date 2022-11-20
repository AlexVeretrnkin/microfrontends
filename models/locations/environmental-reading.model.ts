export class EnvironmentalReadingModel {
  public id?: number;
  public automatic?: boolean;
  public roomId: number;
  public currentTime: string | Date;
  public temperature: number;
  public humidity: number;
  public notes: string;

  constructor(reading?: EnvironmentalReadingModel) {
    this.id = reading?.id;
    this.automatic = reading?.automatic;
    this.roomId = reading?.roomId!;
    this.currentTime = reading?.currentTime! && new Date(reading?.currentTime!).toISOString();
    this.temperature = reading?.temperature!;
    this.humidity = reading?.humidity!;
    this.notes = reading?.notes!;
  }
}
