import { Action } from '@ngrx/store';
import { Order } from '../../shared/order.model';

export const UPDATE_SEARCH_FILTERS = 'UPDATE_SEARCH_FILTERS';
export const SELECT_ORDER = 'SELECT_ORDER';

export class UpdateSearchFilters implements Action {
  readonly type = UPDATE_SEARCH_FILTERS;

  constructor(public payload: boolean[]) {}
}

export class SelectOrder implements Action {
    readonly type = SELECT_ORDER;
  
    constructor(public payload: Order) {}
  }



export type SOActions = UpdateSearchFilters | SelectOrder;
