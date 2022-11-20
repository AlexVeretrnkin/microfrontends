import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import { map, switchMap, take } from 'rxjs/operators';

import { YesNoModalComponent } from '@shared';
import { StoreModel, YesNoEnum } from '@models';
import { AuthService } from '@base-core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { userProfileActions } from '@actions';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortalComponent implements OnInit {
  public userPhotoUrl$!: Observable<string>;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private store: Store<StoreModel>
  ) {
    this.loadGoogleMaps();
  }

  public ngOnInit(): void {
    this.store.dispatch(userProfileActions.getUserProfile());

    this.userPhotoUrl$ = this.store.select('userProfile').pipe(
      map(user => user.photoUrl)
    );
  }

  public onLogOut(): void {
    this.modalService.show<YesNoModalComponent>(
      YesNoModalComponent,
      {
        initialState: {
          data: {
            title: 'Ви впевнені що бааєте вийти?',
            subtitle: 'Цю дію неможливо відмінити'
          }
        }
      }
    ).onHidden
      .pipe(
        switchMap((result: YesNoEnum) => {
          if (result === YesNoEnum.accept) {
            return this.authService.logOut();
          }

          return of(null);
        }),
        take(1)
      )
      .subscribe();
  }

  private loadGoogleMaps(): void {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA-qZCxiLrCUX6LPFxB_xlyAdrhuQCeRPs&callback=initMap';
    script.async = true;

    // @ts-ignore
    window.initMap = () => {
    };

    document.head.appendChild(script);
  }
}

