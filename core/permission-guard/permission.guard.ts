import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreModel, UserProfileModel } from '@models';
import { filter, map, tap } from 'rxjs/operators';
import { userProfileActions } from '@actions';
import { basePermissionsConfig } from '@configs';

@Injectable()
export class PermissionGuard implements CanActivateChild {
  constructor(
    private store: Store<StoreModel>,
    private router: Router
  ) {
  }

  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('userProfile')
      .pipe(
        tap((user: UserProfileModel) => {
          if (!user?.id) {
            this.store.dispatch(userProfileActions.getUserProfile());
          }
        }),
        filter(user => !!user?.id),
        map((user: UserProfileModel) => {
          const path: string = route.url[0].path;

          if (basePermissionsConfig.includes(path)) {
            return true;
          }

          const isActive: boolean = [...user.permissions!, ...basePermissionsConfig]
            .some((item) => item.toLowerCase().includes(path.replace('-', '')));

          if (!isActive) {
            this.router.navigate(['/portal']);
          }

          return isActive;
        })
      );
  }
}
