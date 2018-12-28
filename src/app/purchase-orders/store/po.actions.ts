import { Action } from '@ngrx/store';
import { Provider } from '../../shared/provider.model';
import { PO } from '../../shared/po.model';

export const GET_PROVIDERS = 'GET_PROVIDERS';
export const SET_PROVIDERS = 'SET_PROVIDERS';
export const SAVE_ORDER = 'SAVE_ORDER';
export const PO_ERROR = 'PO ERROR';
export const PO_SAVED_SUCCESSFULLY = 'PO_SAVED_SUCCESSFULLY';
export const SET_PO_DRAFTS = 'SET_PO_DRAFTS';
export const GET_PO_DRAFTS = 'GET_PO_DRAFTS';
export const SET_PO_PROCESSED = 'SET_PO_PROCESSED';
export const GET_PO_PROCESSED = 'GET_PO_PROCESSED';
export const SET_PO = 'SET_PO';
export const SET_INVENTORY_DATA = 'SET_INVENTORY_DATA';

export class GetProviders implements Action {
  readonly type = GET_PROVIDERS;
}

export class SetProviders implements Action {
  readonly type = SET_PROVIDERS;
  
  constructor(public payload: Provider[]) {}
}

export class GetPODrafts implements Action {
  readonly type = GET_PO_DRAFTS;
}

export class SetPODrafts implements Action {
  readonly type = SET_PO_DRAFTS;
  
  constructor(public payload: PO[]) {}
}

export class GetPOProcessed implements Action {
  readonly type = GET_PO_PROCESSED;
}

export class SetPOProcessed implements Action {
  readonly type = SET_PO_PROCESSED;
  
  constructor(public payload: PO[]) {}
}

export class SetPO implements Action {
  readonly type = SET_PO;
  
  constructor(public payload: PO) {}
}

export class SavePurchaseOrder implements Action {
  readonly type = SAVE_ORDER;
  
  constructor(public payload: PO) {}
}

export class ErrorAction implements Action {
  readonly type = PO_ERROR;
  
  constructor(public payload: any) {}
}

export class SaveSuccess implements Action {
  readonly type = PO_SAVED_SUCCESSFULLY;
  
  constructor(public payload: string) {}
}

export class SetInvData implements Action {
  readonly type = SET_INVENTORY_DATA;
  
  constructor(public payload: any) {}
}

export type POActions = GetProviders | SetProviders | SavePurchaseOrder | ErrorAction | SaveSuccess | SetPODrafts | GetPODrafts | SetPOProcessed | GetPOProcessed | SetPO | SetInvData ;
