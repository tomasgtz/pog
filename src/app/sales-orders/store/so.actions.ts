import { Action } from '@ngrx/store';
import { Order } from '../../shared/order.model';
import { LineItem } from 'src/app/shared/line-item.model';

export const UPDATE_SEARCH_FILTERS = 'UPDATE_SEARCH_FILTERS';
export const SELECT_ORDER = 'SELECT_ORDER';
export const SET_TRANSFER_ITEMS = 'SET_TRANSFER_ITEMS';
export const CHECK_SO_STATUS = 'CHECK_SO_STATUS';
export const SO_ERROR = 'SO_ERROR';
export const SO_SUCCESS = 'SO_SUCCESS';
export const SO_AS_COMPLETE = 'SO_AS_COMPLETE';


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

  constructor(public payload: LineItem[]) {  

    console.log("se recibe la accion de poner items en el store", payload.slice(0));
  }
}

export class CheckSOStatus implements Action {
  readonly type = CHECK_SO_STATUS;
  
}

export class ErrorAction implements Action {
  readonly type = SO_ERROR;
  
  constructor(public payload: any) {}
}

export class SuccessAction implements Action {
  readonly type = SO_SUCCESS;
  
  constructor(public payload: any) {}
}


export class SetOrderAsComplete implements Action {
  readonly type = SO_AS_COMPLETE;

}  



export type SOActions = UpdateSearchFilters | SelectOrder | SetItemsToTransfer | CheckSOStatus | ErrorAction | SuccessAction | SetOrderAsComplete;
