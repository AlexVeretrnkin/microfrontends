import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BuildingModel, GroupModel, QueryModel, StoreModel } from '@models';
import { RoutesEnum } from '../../../../routes.enum';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { tableActions } from '@actions';
import { selectTable } from '@selectors';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {
  public building$!: Observable<BuildingModel>;

  public readonly routes: typeof RoutesEnum = RoutesEnum;

  private query: QueryModel<GroupModel> = new QueryModel<BuildingModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.paramMap.get(this.routes.manageBuildingId)!
    };

    this.store.dispatch(tableActions.initTableData({field: 'buildings', query: this.query}));

    this.building$ = this.store.select(selectTable('buildings'))
      .pipe(
        pluck('items'),
        map(items => items && items[0] as BuildingModel),
      );
  }
}
