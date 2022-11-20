import { ContactInfoModel } from './contact-info.model';

export class AddUserModel {
  public id?: number;
  public firstName!: string;
  public lastName!: string;
  public photo?: File | string;
  public photoUrl?: string;
  public contactInfos!: ContactInfoModel[];
  public password?: string;

  constructor(userToAdd?: AddUserModel) {
    this.firstName = userToAdd?.firstName!;
    this.lastName = userToAdd?.lastName!;
    this.photo = userToAdd?.photo!;
    this.contactInfos = userToAdd?.contactInfos!;
  }
}
