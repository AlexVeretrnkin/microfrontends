import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { StoreModel, YesNoEnum } from '@models';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { DeleteModalComponent } from '@portal-shared';
import { Observable, of } from 'rxjs';
import { AuthService } from '@base-core';
import { ManageUsersService } from '@core';

@Component({
  selector: 'app-additional',
  templateUrl: './additional.component.html',
  styleUrls: ['./additional.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalComponent {
  private readonly deleteWord: string = 'Видалити';

  constructor(
    private modalService: BsModalService,
    private store: Store<StoreModel>,
    private authService: AuthService,
    private manageUsersService: ManageUsersService
  ) { }

  public deleteAccount(): void {
    this.modalService.show(DeleteModalComponent, {
      initialState: {
        data: {
          title: 'Видалення користувача',
          subtitle: `Для підтвердження, уведіть “${this.deleteWord}”`,
          deleteWord: this.deleteWord
        }
      }
    })
      .onHidden
      .pipe(
        switchMap((value: YesNoEnum) => {
          if (value === YesNoEnum.accept) {
            return this.deleteUser();
          }

          return of(null!);
        }),
        take(1)
      ).subscribe();
  }

  private deleteUser(): Observable<null> {
    return this.store.select('userProfile')
      .pipe(
        map(user => user.id),
        switchMap(id => this.manageUsersService.deleteUser(id!)),
        tap(_ => this.authService.unauthorizedLogOut())
      );
  }
}
