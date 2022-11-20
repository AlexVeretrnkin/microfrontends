import {environment} from '../src/environments/environment';

export class ApiUrls {
  private static readonly userServiceUrl: string = environment.apiUrl;
  private static readonly metricsServiceUrl: string = environment.metricsServiceUrl;
  private static readonly documentsServiceUrl: string = environment.documentsServiceUrl;

  public static getUserUrl(): string {
    return `${this.userServiceUrl}users/auth-user/`;
  }

  public static getChangePasswordUrl(): string {
    return `${this.userServiceUrl}users/change-password/`;
  }

  public static getUsersUrl(): string {
    return `${this.userServiceUrl}users/`;
  }

  public static getUserInvitesUrl(): string {
    return `${this.userServiceUrl}users/invites/`;
  }

  public static getUserByIdUrl(userId: number): string {
    return `${this.userServiceUrl}users/${userId}/`;
  }

  public static getUserContactInfoUrl(userId: string = ''): string {
    return `${this.userServiceUrl}users/contact-info/${userId}`;
  }

  public static getUsersAddUrl(): string {
    return `${this.userServiceUrl}users/add-user/`;
  }

  public static getUsersGroupsUrl(id: string = ''): string {
    return `${this.userServiceUrl}users/groups/${id}`;
  }

  public static getUsersGroupsAddUserUrl(groupId: number): string {
    return `${this.userServiceUrl}users/groups/${groupId}/add-user/`;
  }

  public static getUsersGroupsAddAdminUrl(groupId: number): string {
    return `${this.userServiceUrl}users/groups/${groupId}/add-admin/`;
  }

  public static getUsersGroupsRemoveUserUrl(groupId: number, userId: number): string {
    return `${this.userServiceUrl}users/groups/${groupId}/remove-user/${userId}`;
  }

  public static getLocationsUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/locations/${id}`;
  }

  public static getLocationDeleteUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/locations/${id}/`;
  }

  public static getBuildingTypesUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/building-types/${id}`;
  }

  public static getBuildingTypesCountUrl(): string {
    return `${this.metricsServiceUrl}metrics/building-types/count/`;
  }

  public static getBuildingUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/buildings/${id}`;
  }

  public static getFloorUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/floors/${id}`;
  }

  public static getMetersUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/meters/${id}`;
  }

  public static getSnapshotsUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/meter-snapshots/${id}`;
  }

  public static getHeadCountUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/headcount/${id}`;
  }

  // todo will be removed
  public static getDeviceTypesUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/device_types/${id}`;
  }

  public static getRoomsUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/rooms/${id}`;
  }

  public static getRoomEnvironmentalReadingsUrl(id: string = ''): string {
    return `${this.metricsServiceUrl}metrics/rooms/environmental-readings/${id}`;
  }

  public static getDocumentsUrl(id: string = ''): string {
    return `${this.documentsServiceUrl}documents/${id}`;
  }

  public static getDocumentationUrl(id: string = ''): string {
    return `${this.documentsServiceUrl}documents/documentation/${id}`;
  }

  public static getContractsUrl(id: string = ''): string {
    return `${this.documentsServiceUrl}documents/supply-contracts/${id}`;
  }

  public static getTariffsUrl(id: string = ''): string {
    return `${this.documentsServiceUrl}documents/tariffs/${id}`;
  }
}
