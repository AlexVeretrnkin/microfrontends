import { TypeModel } from '../locations/type.model';
import { BuildingModel } from '../locations/building.model';

export class BuildingTypeModel extends TypeModel {
  public buildings!: BuildingModel[];
  public buildingsCount!: number;

  constructor(type?: BuildingTypeModel) {
    super();

    this.buildingsCount = type?.buildingsCount! || type?.buildings?.length! || 0;
    this.buildings = type?.buildings!;
    this.id = type?.id!;
    this.name = type?.name!;
  }
}
