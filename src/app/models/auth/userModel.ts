export class UserModel {
  public email: string;
  public firstName: string;
  public lastName: string;
  public password: string;

  constructor(user: UserModel) {
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.password = user.password;
  }
}
