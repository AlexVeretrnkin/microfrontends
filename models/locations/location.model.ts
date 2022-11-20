import { BuildingModel } from './building.model';
import { AddLocationModel } from './add-location.model';

export class LocationModel extends AddLocationModel {
  public id!: number;
  public buildings!: BuildingModel[];
  public coordinates?: string;

  constructor(location?: LocationModel) {
    super(location);

    this.id = location?.id!;
    this.buildings = location?.buildings!;
    this.coordinates = (location?.latitude && location?.longitude) ? `${location?.latitude!} ${location?.longitude!}` : null!;
  }
}
