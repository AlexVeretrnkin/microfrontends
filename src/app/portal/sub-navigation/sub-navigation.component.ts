import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { NavigationBarService } from '@core';

import { NavigationBarModel, StoreModel, UserProfileModel } from '@models';

import { RoutesEnum } from '../../routes.enum';
import { filter, map } from 'rxjs/operators';
import { basePermissionsConfig } from '@configs';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({opacity: 0, 'animation-fill-mode': 'both'}),
        animate(
          `500ms {{ delay }}ms`,
          keyframes([
            style({
              transform: 'translateX(-100px)',
              'animation-timing-function': 'ease-in',
              opacity: 0,
              offset: 0
            }),
            style({
              transform: 'translateX(0)',
              'animation-timing-function': 'ease-out',
              opacity: 1,
              offset: 0.38
            }),
            style({
              transform: 'translateX(28px)',
              'animation-timing-function': 'ease-in',
              offset: 0.55
            }),
            style({
              transform: 'translateX(0)',
              'animation-timing-function': 'ease-out',
              offset: 0.72
            }),
            style({
              transform: 'translateX(0)',
              'animation-timing-function': 'ease-out',
              offset: 1
            }),
          ])),
      ])
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubNavigationComponent implements OnInit {
  public navigationBar$!: Observable<NavigationBarModel>;

  public readonly animationDelay: number = 80;

  public readonly date: Date = new Date();

  constructor(
    private navigationBarService: NavigationBarService,
    private store: Store<StoreModel>
  ) {
  }

  @HostBinding('@.disabled') disabled = true;

  public ngOnInit(): void {
    this.navigationBarService.initNavigationBar();

    this.navigationBar$ = this.store.select('navigationBar');
  }

  public isNavigationEnabled(path: string): Observable<boolean> {
    return this.store.select('userProfile').pipe(
      filter(user => !!user?.id),
      map((user: UserProfileModel) => {
        return [...user.permissions!, ...basePermissionsConfig]
          .some((item) => item.toLowerCase().includes(path?.replace('-', '')));
      })
    );
  }
}
