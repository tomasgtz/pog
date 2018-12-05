import * as SOActions from './so.actions';
import { Order } from '../../shared/order.model';

export interface State {
  checks;
  selected_order: Order;
}

const initialState: State = {
  checks: {'ckhCMH': false, 'ckhCTRL': false, 'ckhSS': false, 'ckhEOL': false},
  selected_order: null
};

export function soReducer(state = initialState, action: SOActions.SOActions) {
  switch (action.type) {
    
    case (SOActions.UPDATE_SEARCH_FILTERS): {

      return {
        ...state,
        checks: action.payload
      };

    }
      
    case (SOActions.SELECT_ORDER):
    return {
      ...state,
      selected_order: action.payload
    };
   
    default:
      return state;
  }
}
