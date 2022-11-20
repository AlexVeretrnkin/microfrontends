export class RoomModel {
  public id?: number;
  public index!: string;
  public floorId!: number;
  public size!: number;
  public designation!: string;
  public responsibleDepartment!: string;


  constructor(room?: RoomModel) {
    this.id = room?.id;
    this.index = room?.index!;
    this.floorId = room?.floorId!;
    this.size = room?.size!;
    this.designation = room?.designation!;
    this.responsibleDepartment = room?.responsibleDepartment!;
  }
}
