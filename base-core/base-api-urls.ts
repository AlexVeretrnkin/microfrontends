import { environment } from '../src/environments/environment';

export class BaseApiUrls {
    private static readonly apiRoot: string = environment.apiUrl;

    public static getRegisterUrl(): string {
        return `${this.apiRoot}register/`;
    }

    public static getLoginUrl(): string {
        return `${this.apiRoot}login/`;
    }

    public static getLogoutUrl(): string {
        return `${this.apiRoot}logout/`;
    }

    public static getInviteUrl(secretKey: string): string {
        return `${this.apiRoot}users/invites/${secretKey}/`;
    }

    public static getInviteCommitUrl(secretKey: string): string {
        return `${this.apiRoot}users/invites/${secretKey}/commit/`;
    }

    public static getRefreshTokenUrl(): string {
        return `${this.apiRoot}token/refresh/`;
    }
}
