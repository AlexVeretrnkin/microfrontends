import { NavigationBarModel } from '@models';
import { createReducer, on } from '@ngrx/store';
import { navigationActions } from '@actions';
import { TypedAction } from '@ngrx/store/src/models';
import { navigationBarConfig } from '@configs';

const initialState: NavigationBarModel = {
  ...navigationBarConfig[0],
  currentSubRouteName: navigationBarConfig[0].subRoutesMenu[0].name
};

const _navigationBarReducer = createReducer(
  initialState,
  on(
    navigationActions.setNavigationBar,
    (_, payload: NavigationBarModel) => payload ? ({...payload}) : null!
  )
);

export function navigationBarReducer(state: NavigationBarModel, action: TypedAction<string>): NavigationBarModel {
  return _navigationBarReducer(state, action);
}
