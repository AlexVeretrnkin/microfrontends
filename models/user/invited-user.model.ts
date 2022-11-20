import { BaseUserModel } from './base-user.model';
import { UserProfileModel } from './user-profile.model';
import { environment } from '../../src/environments/environment';

export class InvitedUserModel {
  public id!: number;
  public created!: string;
  public updated!: string;
  public secretKey!: string;
  public expirationDate!: string;
  public invitee!: BaseUserModel;
  public inviter!: UserProfileModel;
  public inviteeName?: string;
  public inviterName?: string;
  public inviteLink?: string;

  constructor(invitedUser?: InvitedUserModel) {
    this.id = invitedUser?.id!;
    this.created = invitedUser?.created!;
    this.updated = invitedUser?.updated!;
    this.secretKey = invitedUser?.secretKey!;
    this.expirationDate = invitedUser?.expirationDate!;
    this.invitee = invitedUser?.invitee!;
    this.inviter = invitedUser?.inviter!;
    this.inviteeName = `${invitedUser?.invitee?.firstName} ${invitedUser?.invitee?.lastName}`;
    this.inviterName = `${invitedUser?.inviter?.firstName} ${invitedUser?.inviter?.lastName}`;
    this.inviteLink = `${environment.baseUrl}register/${invitedUser?.secretKey}`;
  }
}
