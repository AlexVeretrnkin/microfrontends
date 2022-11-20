export class BaseUserModel {
  public id?: number;
  public email: string;
  public firstName: string;
  public lastName: string;
  public password?: string;

  constructor(user?: BaseUserModel) {
    this.firstName = user?.firstName || null!;
    this.lastName = user?.lastName || null!;
    this.email = user?.email || null!;
  }
}
