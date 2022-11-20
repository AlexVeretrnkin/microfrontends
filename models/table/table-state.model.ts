import { UserProfileModel } from '../user/user-profile.model';
import { InvitedUserModel } from '../user/invited-user.model';
import { LocationModel } from '../locations/location.model';
import { BuildingTypeModel } from '../building/building-type.model';
import { BuildingModel } from '../locations/building.model';
import { RoomModel } from '../locations/room.model';
import { DocumentModel } from '../documents/document.model';
import { DocumentationModel } from '../documents/documentation.model';
import { ContractModel } from '../documents/contract.model';
import { FloorModel } from '../building/floor.model';
import { GroupModel } from '../user/group.model';
import { MeterModel } from '../meters/meter.model';
import { TariffModel } from '../tariff/tariff.model';
import { PaginationModel } from '../pagination.model';
import { SnapshotModel } from '../meters/snapshot.model';

export class TableStateModel {
  public manageUsers!: PaginationModel<UserProfileModel>;
  public usersInGroup!: PaginationModel<UserProfileModel>;
  public invitedUsers!: PaginationModel<InvitedUserModel>;
  public locations!: PaginationModel<LocationModel>;
  public buildingTypesCount!: PaginationModel<BuildingTypeModel>;
  public buildings!: PaginationModel<BuildingModel>;
  public rooms!: PaginationModel<RoomModel>;
  public documents!: PaginationModel<DocumentModel>;
  public documentation!: PaginationModel<DocumentationModel>;
  public devices!: PaginationModel<MeterModel>;
  public snapshots!: PaginationModel<SnapshotModel>;
  public contracts!: PaginationModel<ContractModel>;
  public floors!: PaginationModel<FloorModel>;
  public groups!: PaginationModel<GroupModel>;
  public tariffs!: PaginationModel<TariffModel>;
  public environmentalReadings!: PaginationModel<GroupModel>;
}
