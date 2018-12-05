import * as AuthActions from './auth.actions';
import { createFeatureSelector, createSelector } from '../../../../node_modules/@ngrx/store';

export interface AuthState {
  token: string;
  authenticated: boolean;
  name: string;
  image: string;
}

const initialState: AuthState = {
  token: '',
  authenticated: false,
  name: '',
  image: ''
};

export const getUserState = createFeatureSelector<AuthState>('user');
export const getCards = createSelector(
    getUserState,
    state => {state.name,state.authenticated,state.image,state.token}
); 

export function authReducer(state = initialState, action: AuthActions.AuthActions): AuthState {
  switch (action.type) {
    case (AuthActions.SIGNUP):
    case (AuthActions.SIGNIN):
      return {
        ...state,
        authenticated: true
      };
    case (AuthActions.LOGOUT):
      return {
        ...state,
        token: null,
        authenticated: false
      };
    case (AuthActions.SET_TOKEN):
      return {
        ...state
      };
    case (AuthActions.SET_USER_DATA):
      return {
        ...state,
        name: action.payload.name,
        image: action.payload.image
      };
    default:
      return state;
  }
}
