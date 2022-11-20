import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldInputModel, FloorModel, ModalActionEnum, ModalActionModel, QueryModel, RoomModel, StoreModel } from '@models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { tableActions } from '@actions';
import { selectTable } from '@selectors';
import { map, pluck, take, tap } from 'rxjs/operators';
import { RoutesEnum } from '../../../../../routes.enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InputModalComponent } from '@portal-shared';
import { excludedFieldConfig } from '@configs';

@Component({
  selector: 'app-room-general',
  templateUrl: './room-general.component.html',
  styleUrls: ['./room-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomGeneralComponent implements OnInit {
  public room$!: Observable<RoomModel>;

  private query: QueryModel<RoomModel> = new QueryModel<RoomModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>,
    private modalService: BsModalService,
  ) {
  }

  public ngOnInit(): void {
    this.query.filters = {
      id: +this.activatedRoute.snapshot.parent?.paramMap.get(RoutesEnum.manageRoomId)!
    };

    this.store.dispatch(tableActions.initTableData({field: 'rooms', query: this.query}));

    this.room$ = this.store.select(selectTable('rooms'))
      .pipe(
        pluck('items'),
        map(items => items && items[0] as RoomModel)
      );
  }

  public openInputModal(type?: RoomModel): void {
    this.modalService.show<InputModalComponent<RoomModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування кімнати',
            subheading: 'Уведіть/змініть дані',
            inputModel: new RoomModel(type),
            excludedFields: [...excludedFieldConfig, 'floorId'],
            fieldsOptions: null!,
            fieldTypes: this.getFieldTypes()
          }
        }
      }
    ).onHidden
      .pipe(
        tap((value: ModalActionModel<RoomModel>) => {
          if (value.action === ModalActionEnum.edit) {
            this.store.dispatch(tableActions.updateTableData({field: 'rooms', item: value.data!}));
          }
        }),
        take(1)
      )
      .subscribe();
  }

  private getFieldTypes(): Map<keyof RoomModel, Partial<FieldInputModel<RoomModel>>> {
    const result: Map<keyof RoomModel, Partial<FieldInputModel<RoomModel, FloorModel>>> =
      new Map<keyof RoomModel, Partial<FieldInputModel<RoomModel, FloorModel>>>();

    Object.keys(new RoomModel()).forEach(key => result.set(key as keyof RoomModel, {isObligatory: true}));

    return result;
  }
}
