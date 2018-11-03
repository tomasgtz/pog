import { ActionReducerMap } from '@ngrx/store';

//import * as fromShoppingList from '../shopping-list/store/shopping-list.reducers';
import * as fromAuth from '../auth/store/auth.reducers';
import * as fromSO from '../sales-orders/store/so.reducers';
import * as fromPO from '../purchase-orders/store/po.reducers';

export interface AppState {
 // shoppingList: fromShoppingList.State,
  auth: fromAuth.State,
  so: fromSO.State,
  po: fromPO.State
}

export const reducers: ActionReducerMap<AppState> = {
 // shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  so: fromSO.soReducer,
  po: fromPO.poReducer
};
