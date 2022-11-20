import { SubNavigationModel } from './sub-navigation.model';

export class NavigationBarModel {
  public mainRoute!: string;
  public currentSubRouteName?: string;
  public subRoutesMenu!: SubNavigationModel[];
}
