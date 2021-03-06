import * as SOActions from './so.actions';
import { Order } from '../../shared/order.model';
import { LineItem } from 'src/app/shared/line-item.model';

export interface State {
  checks;
  selected_order: Order;
  items_to_transfer: LineItem[];
  error: string;
  message: string;
}

const initialState: State = {
  checks: {'ckhCMH': false, 'ckhCTRL': false, 'ckhSS': false, 'ckhEOL': false},
  selected_order: null,
  items_to_transfer: [],
  error: null,
  message: null
};

export function soReducer(state = initialState, action: SOActions.SOActions) {
  switch (action.type) {
    
    case (SOActions.UPDATE_SEARCH_FILTERS): {

      return {
        ...state,
        checks: action.payload
      };

    }
      
    case (SOActions.SELECT_ORDER): {
    return {
      ...state,
      selected_order: action.payload,
      items_to_transfer: []
    };
  }

  case (SOActions.SET_TRANSFER_ITEMS): 
  {
    console.log("reducers", action.payload);
    return {
      ...state,
      items_to_transfer: action.payload
    };
  }
  
  case (SOActions.SO_ERROR): {
    return {
      ...state,
      error: "Error: " + action.payload
    };
  }
    
  case (SOActions.SO_SUCCESS):  {
    return {
      ...state,
      message: action.payload
    };
  }
  
  default:
    return state;
  }
}
