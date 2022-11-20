import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoutesEnum } from '../../../../routes.enum';
import { Observable } from 'rxjs';
import { BuildingModel, FloorModel, QueryModel, RoomModel, StoreModel } from '@models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BuildingService, FloorService } from '@core';
import { tableActions } from '@actions';
import { selectTable } from '@selectors';
import { map, pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent implements OnInit {
  public room$!: Observable<RoomModel>;

  public building$!: Observable<BuildingModel>;

  public floor$!: Observable<FloorModel>;

  public readonly routes: typeof RoutesEnum = RoutesEnum;

  private query: QueryModel<RoomModel> = new QueryModel<RoomModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>,
    private buildingsService: BuildingService,
    private floorService: FloorService
  ) {
  }

  public ngOnInit(): void {
    this.query.filters = {
      id: +this.activatedRoute.snapshot.paramMap.get(this.routes.manageRoomId)!
    };

    this.store.dispatch(tableActions.initTableData({field: 'rooms', query: this.query}));

    this.room$ = this.store.select(selectTable('rooms'))
      .pipe(
        pluck('items'),
        map(items => items && items[0] as RoomModel),
        tap(room => {
          this.initFloor(room);
        })
      );
  }

  private initFloor(room: RoomModel): void {
    if (room) {
      this.floor$ = this.floorService.read(new QueryModel({
          pageNumber: null!,
          pageSize: null!,
          filters: {
            id: room?.floorId
          }
        } as unknown as QueryModel<FloorModel>
      )).pipe(
        pluck('items'),
        map(r => r && r[0]),
        tap(f => this.initBuilding(f))
      );
    }
  }

  private initBuilding(floor: FloorModel): void {
    this.building$ = this.buildingsService.getBuildings(new QueryModel({
        pageNumber: null!,
        pageSize: null!,
        filters: {
          id: floor?.buildingId
        }
      } as unknown as QueryModel<FloorModel>
    )).pipe(
      pluck('items'),
      map(r => r && r[0])
    );
  }
}
