import { BaseUserModel } from './base-user.model';
import { ContactInfoModel } from './contact-info.model';
import { PermissionsEnum } from './permissions.enum';

export class UserProfileModel extends BaseUserModel {
  public created!: string;
  public updated!: string;
  public contactInfos!: ContactInfoModel[];
  public photoUrl!: string;
  public photo!: File;
  public activated!: boolean;
  public permissions?: PermissionsEnum[];

  constructor(userProfile?: UserProfileModel) {
    super(userProfile);

    this.created = userProfile?.created ?? null!;
    this.updated = userProfile?.updated ?? null!;
    this.contactInfos = userProfile?.contactInfos ?? null!;
    this.photoUrl = userProfile?.photoUrl ?? null!;
    this.photo = userProfile?.photo ?? null!;
    this.activated = userProfile?.activated ?? null!;
    this.permissions = userProfile?.permissions ?? null!;
  }
}
