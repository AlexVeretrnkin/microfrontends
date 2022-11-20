import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupModel, QueryModel, StoreModel } from '@models';
import { RoutesEnum } from '../../../../routes.enum';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { tableActions } from '@actions';
import { selectTable } from '@selectors';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent implements OnInit {
  public group$!: Observable<GroupModel>;

  public readonly routes: typeof RoutesEnum = RoutesEnum;

  private query: QueryModel<GroupModel> = new QueryModel<GroupModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.paramMap.get(this.routes.manageGroupId)!
    };

    this.store.dispatch(tableActions.initTableData({field: 'groups', query: this.query}));

    this.group$ = this.store.select(selectTable('groups'))
      .pipe(
        pluck('items'),
        map(items => items && items[0] as GroupModel),
      );
  }
}
