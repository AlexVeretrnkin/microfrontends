import { PermissionsEnum } from './permissions.enum';

export class GroupModel {
  public id?: number;
  public created: string;
  public updated: string;
  public name: string;
  public parentGroupId: number;
  public permissions?: PermissionsEnum[];

  constructor(group?: GroupModel) {
    this.id = group?.id;
    this.created = group?.created!;
    this.updated = group?.updated!;
    this.name = group?.name!;
    this.parentGroupId = group?.parentGroupId!;
    this.permissions = group?.permissions;
  }
}
