import { createAction, props } from '@ngrx/store';

import { NavigationBarModel } from '@models';

const setNavigationBar = createAction(
  '[NavigationBa] Set',
  props<NavigationBarModel>()
);

export const navigationActions = {
  setNavigationBar
};
