export class ChangePasswordModel {
  public oldPassword: string;
  public newPassword: string;
  public repeatPassword: string;

  constructor(passwordModel?: ChangePasswordModel) {
    this.oldPassword = passwordModel?.oldPassword!;
    this.newPassword = passwordModel?.newPassword!;
    this.repeatPassword = passwordModel?.repeatPassword!;
  }
}
