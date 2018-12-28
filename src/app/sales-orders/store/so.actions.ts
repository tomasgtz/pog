import { Action } from '@ngrx/store';
import { Order } from '../../shared/order.model';
import { LineItem } from 'src/app/shared/line-item.model';

export const UPDATE_SEARCH_FILTERS = 'UPDATE_SEARCH_FILTERS';
export const SELECT_ORDER = 'SELECT_ORDER';
export const SET_TRANSFER_ITEMS = 'SET_TRANSFER_ITEMS';

export class UpdateSearchFilters implements Action {
  readonly type = UPDATE_SEARCH_FILTERS;

  constructor(public payload: boolean[]) {}
}

export class SelectOrder implements Action {
  readonly type = SELECT_ORDER;

  constructor(public payload: Order) {}
}

export class SetItemsToTransfer implements Action {
  readonly type = SET_TRANSFER_ITEMS;

  constructor(public payload: LineItem[]) {  }
}



export type SOActions = UpdateSearchFilters | SelectOrder | SetItemsToTransfer;
