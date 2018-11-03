import { Action } from '@ngrx/store';
import { Provider } from '../../shared/provider.model';

export const GET_PROVIDERS = 'GET_PROVIDERS';
export const SET_PROVIDERS = 'SET_PROVIDERS';

export class GetProviders implements Action {
  readonly type = GET_PROVIDERS;
  
  constructor(public payload: Provider[]) {}
}

export class SetProviders implements Action {
  readonly type = SET_PROVIDERS;
  
  constructor(public payload: Provider[]) {}
}

export type POActions = GetProviders | SetProviders;
