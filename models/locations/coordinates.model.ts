export class CoordinatesModel {
  public longitude!: number;
  public latitude!: number;
  public coordinates?: string;

  constructor(coordinates?: CoordinatesModel) {
    this.longitude = coordinates?.longitude || null!;
    this.latitude = coordinates?.latitude || null!;
    this.coordinates = `${coordinates?.latitude!} ${coordinates?.longitude!}`;
  }
}
