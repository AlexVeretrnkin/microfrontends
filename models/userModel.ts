import { ILoadable } from './i-loadable';

import { BaseUserModel } from './user/base-user.model';

export class UserModel extends BaseUserModel {
  public access!: string;
  public refresh!: string;
  public error?: { [p: string]: string };
  public loading?: boolean;


  constructor(user?: UserModel) {
    super(user);

    this.access = user?.access || null!;
    this.refresh = user?.refresh || null!;
  }
}
