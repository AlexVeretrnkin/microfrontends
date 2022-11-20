import { PermissionsEnum } from './permissions.enum';

export class TablePermissionModel {
  public permission!: PermissionsEnum;

  constructor(permission: PermissionsEnum) {
    this.permission = permission;
  }
}
