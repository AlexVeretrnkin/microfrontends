import { TableStateModel } from '@models';
import { createReducer, on } from '@ngrx/store';
import { tableActions } from '@actions';
import { TypedAction } from '@ngrx/store/src/models';

const initState: TableStateModel = new TableStateModel();

const _tablesReducer = createReducer(
  initState,
  on(
    tableActions.setTableData,
    (state: TableStateModel, payload: Partial<TableStateModel>) => {
      return {
        ...state,
        ...payload
      };
    }
  ),
);

export function tablesReducer(state: TableStateModel, action: TypedAction<string>): TableStateModel {
  return _tablesReducer(state, action);
}
