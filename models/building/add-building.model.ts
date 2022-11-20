export class AddBuildingModel {
  public id?: number;
  public locationId!: number;
  public buildingTypeId!: number;
  public name!: string;
  public address!: string;
  public photoDocumentId?: number;
  public constructionType?: string;
  public constructionYear!: number;
  public climateZone?: string;
  public heatSupplyContractId?: number;
  public electricitySupplyContractId?: number;
  public waterSupplyContractId?: number;
  public operationSchedule?: number;
  public operationHoursPerYear?: number;
  public studyingDaytime!: number;
  public studyingEveningTime!: number;
  public studyingPartTime!: number;
  public workingTeachers!: number;
  public workingScience!: number;
  public workingHelp!: number;
  public livingQuantity!: number;
  public utilizedSpace?: number;
  public utilitySpace?: number;


  constructor(building?: AddBuildingModel) {
    this.id = building?.id!;
    this.locationId = isNaN(building?.locationId!) ? building?.locationId! : +building?.locationId! || null!;
    this.buildingTypeId = isNaN(building?.buildingTypeId!) ? building?.buildingTypeId! :  +building?.buildingTypeId! || null!;
    this.name = building?.name!;
    this.address = building?.address!;
    this.photoDocumentId = +building?.photoDocumentId! || null!;
    this.constructionType = building?.constructionType!;
    this.constructionYear = +building?.constructionYear! || null!;
    this.climateZone = building?.climateZone;
    this.heatSupplyContractId = +building?.heatSupplyContractId! || null!;
    this.electricitySupplyContractId = +building?.electricitySupplyContractId! || null!;
    this.waterSupplyContractId = +building?.waterSupplyContractId! || null!;
    this.operationSchedule = +building?.operationSchedule! || null!;
    this.operationHoursPerYear = +building?.operationHoursPerYear! || null!;
    this.studyingDaytime = +building?.studyingDaytime! || null!;
    this.studyingEveningTime = +building?.studyingEveningTime! || null!;
    this.studyingPartTime = +building?.studyingPartTime! || null!;
    this.workingTeachers = +building?.workingTeachers! || null!;
    this.workingScience = +building?.workingScience! || null!;
    this.workingHelp = +building?.workingHelp! || null!;
    this.livingQuantity = +building?.livingQuantity! || null!;
    this.utilizedSpace = +building?.utilizedSpace! || null!;
    this.utilitySpace = +building?.utilitySpace! || null!;
  }
}
