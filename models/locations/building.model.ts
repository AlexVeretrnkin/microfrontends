import { RoomModel } from './room.model';
import { TypeModel } from './type.model';

import { AddLocationModel } from './add-location.model';

import { AddBuildingModel } from '../building/add-building.model';
import { FloorModel } from '../building/floor.model';
import { MeterModel } from '../meters/meter.model';

export class BuildingModel extends AddBuildingModel {
  public id!: number;
  public locationId!: number;
  public buildingTypeId!: number;
  public name!: string;
  public description!: string;
  public livingQuantity!: number;
  public studyingDaytime!: number;
  public studyingEveningTime!: number;
  public studyingPartTime!: number;
  public workingTeachers!: number;
  public workingScience!: number;
  public workingHelp!: number;
  public constructionYear!: number;
  public address!: string;
  public rooms!: RoomModel[];
  public buildingType!: TypeModel;
  public buildingTypeName!: string;
  public locationCoordinates!: string;
  public location!: AddLocationModel;
  public responsiblePeople?: any;
  public floors?: FloorModel[];
  public meters?: MeterModel[];

  constructor(building?: BuildingModel) {
    super(building!);

    this.id = building?.id!;
    this.locationId = building?.locationId!;
    this.buildingTypeId = building?.buildingTypeId!;
    this.name = building?.name!;
    this.livingQuantity = building?.livingQuantity!;
    this.studyingDaytime = building?.studyingDaytime!;
    this.studyingEveningTime = building?.studyingEveningTime!;
    this.studyingPartTime = building?.studyingPartTime!;
    this.workingTeachers = building?.workingTeachers!;
    this.workingScience = building?.workingScience!;
    this.workingHelp = building?.workingHelp!;
    this.constructionYear = building?.constructionYear!;
    this.address = building?.address!;
    this.rooms = building?.rooms!;
    this.buildingType = building?.buildingType!;
    this.buildingTypeName = building?.buildingType?.name!;
    this.responsiblePeople = building?.responsiblePeople!;
    this.location = new AddLocationModel(building?.location!);
    this.locationCoordinates = this.location.coordinates!;
    this.floors = building?.floors!;
    this.meters = building?.meters!;
  }
}
