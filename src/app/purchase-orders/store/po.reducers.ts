import * as POActions from './po.actions';
import { Provider } from '../../shared/provider.model';
import { PO } from '../../shared/po.model';

export interface State {
  providers: Provider[];
  po: PO;
  error: any;
  success: string;
  drafts: PO[];
  inventory: any;
  formulas: any;
}

const initialState: State = {
  providers: [],
  po: new PO('0','','',0,'',[],0,'','','',''),
  error: null,
  success: null,
  drafts: null,
  inventory: null,
  formulas: null
};

export function poReducer(state = initialState, action: POActions.POActions) {
  switch (action.type) {
    
    case (POActions.SET_PROVIDERS):
      return {
        ...state,
        providers: [...action.payload]
      };

    case (POActions.SET_PO_DRAFTS):
    
      return {
        ...state,
        drafts: [...action.payload]
      };

    case (POActions.SET_PO):
      return {
        ...state,
        po: action.payload,
        success: "PO loaded successfully"
      };

    case (POActions.SET_INVENTORY_DATA):
      return {
        ...state,
        inventory: action.payload.data,
        formulas: action.payload.formulas,
        success: "Inventory data loaded successfully"
      };

    case (POActions.SAVE_ORDER):
      return {
        ...state,
        po: action.payload
      };

    case (POActions.PO_ERROR): 
      return {
        ...state,
        error: "Error: " + action.payload
      };
    
     case (POActions.PO_SAVED_SUCCESSFULLY): 
      return {
        ...state,
        error: null,
        success: "PO saved successfully",
        po: {...state.po, id: action.payload}
      };
    
    default:
      return state;
  }
}
