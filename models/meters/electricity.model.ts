export class ElectricityModel {
  public id?: number;
  public meterId!: number;
  public connectionType!: string;
  public transformationCoefficient!: number;

  constructor(electricity?: ElectricityModel) {
    this.id = electricity?.id!;
    this.meterId = electricity?.meterId!;
    this.connectionType = electricity?.connectionType!;
    this.transformationCoefficient = electricity?.transformationCoefficient!;
  }
}
