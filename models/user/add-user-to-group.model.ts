import { UserRoleInGroupEnum } from './user-role-in-group.enum';

export class AddUserToGroupModel {
  public userId: number;
  public userRole: UserRoleInGroupEnum;

  constructor(user?: AddUserToGroupModel) {
    this.userId = user?.userId!;
    this.userRole = user?.userRole!;
  }
}
