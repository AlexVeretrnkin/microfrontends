export class AddLocationModel {
  public id?: number;
  public name!: string;
  public longitude!: string;
  public latitude!: string;
  public coordinates?: string;

  constructor(location?: AddLocationModel) {
    this.name = location?.name || null!;
    this.longitude = location?.longitude || null!;
    this.latitude = location?.latitude || null!;
    this.coordinates = (location?.latitude && location?.longitude) ? `${location?.latitude!} ${location?.longitude!}` : null!;
    this.id = location?.id;
  }
}
