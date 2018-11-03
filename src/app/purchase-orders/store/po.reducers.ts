import * as POActions from './po.actions';
import { Provider } from '../../shared/provider.model';

export interface State {
  providers: Provider[];
}

const initialState: State = {
  providers: []
};

export function poReducer(state = initialState, action: POActions.POActions) {
  switch (action.type) {
    
    case (POActions.SET_PROVIDERS):
      return {
        ...state,
        providers: [...action.payload]
      };
    default:
      return state;
  }
}
