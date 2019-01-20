import * as AuthActions from './auth.actions';
import { createFeatureSelector, createSelector } from '../../../../node_modules/@ngrx/store';

export interface AuthState {
  token: string;
  authenticated: boolean;
  name: string;
  image: string;
  successMessage: {header: string, users: string}
  error: any;
  users: any
}

const initialState: AuthState = {
  token: '',
  authenticated: false,
  name: '',
  image: '',
  successMessage: {header: '', users: ''},
  error: null,
  users: []
};

export const getUserState = createFeatureSelector<AuthState>('user');
export const getCards = createSelector(
    getUserState,
    state => {state.name,state.authenticated,state.image,state.token}
); 

export function authReducer(state = initialState, action: AuthActions.AuthActions): AuthState {
  switch (action.type) {
    case (AuthActions.SIGNUP):
    {
      return {
        ...state,
        authenticated: false,
        successMessage: {header: '', users: action.payload }

      };
    };
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
    case (AuthActions.SET_USERS_DATA):
      return {
        ...state,
        users: action.payload.users,
        successMessage: {header: '', users: action.payload.mesg }
      };
    case (AuthActions.AUTH_ERROR): {
      return {
        ...state,
        error: "Error: " + action.payload
      };
    }
     
    case (AuthActions.SET_SUCCESS_MSG):
      return {
        ...state,
        successMessage: {header: action.payload.msg, users: '' }
      }
    default:
      return state;
  }
}
