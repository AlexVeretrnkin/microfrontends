import { RoomModel } from '../locations/room.model';

export class FloorModel {
  public id?: number;
  public buildingId?: number;
  public index?: string;
  public height?: number;
  public floorPlanDocumentId?: number;
  public rooms?: RoomModel[];
  public items?: any;

  constructor(floor?: FloorModel) {
    this.id = floor?.id ?? null!;
    this.buildingId = floor?.buildingId ?? null!;
    this.index = floor?.index ?? null!;
    this.height = floor?.height ?? null!;
    this.floorPlanDocumentId = floor?.floorPlanDocumentId ?? null!;
    this.rooms = floor?.rooms ?? null!;
    this.items = floor?.items ?? null!;
  }
}
