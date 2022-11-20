import { Injectable } from '@angular/core';
import { ActivationEnd, Event, Route, Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { navigationActions } from '@actions';

import { NavigationBarModel } from '@models';

import { navigationBarConfig } from '@configs';

@Injectable()
export class NavigationBarService {
  private readonly mainRouteIndex: number = 2;

  private readonly portalRoutes!: NavigationBarModel[];

  private mainRouteName: string = null!;

  constructor(
    private router: Router,
    private store: Store,
  ) {
    this.portalRoutes = [...navigationBarConfig];
  }

  public initNavigationBar(): void {
    this.mainRouteName = this.getCurrentMainRoute();

    this.store.dispatch(
      navigationActions.setNavigationBar(this.getActiveNavigationBar(this.mainRouteName))
    );

    this.router.events.subscribe((event: Event) => {
      if (event instanceof ActivationEnd) {
        const newRoute: string = this.getCurrentMainRoute();

        if (this.mainRouteName !== newRoute) {
          this.mainRouteName = newRoute;

          this.store.dispatch(
            navigationActions.setNavigationBar(this.getActiveNavigationBar(this.mainRouteName))
          );
        }
      }
    });
  }

  private getActiveNavigationBar(route: string): NavigationBarModel {
    const activeNavigationBar: NavigationBarModel = this.portalRoutes.find((item: NavigationBarModel) => item.mainRoute === route)!

    return {
      ...activeNavigationBar,
      currentSubRouteName: activeNavigationBar?.subRoutesMenu[0]?.name
    };
  }

  private getCurrentMainRoute(): string {
    return this.router.url.split('/')[this.mainRouteIndex];
  }
}
