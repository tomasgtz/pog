import { Action } from '@ngrx/store';

export const TRY_SIGNUP = 'TRY_SIGNUP';
export const SIGNUP = 'SIGNUP';
export const TRY_SIGNIN = 'TRY_SIGNIN';
export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_DATA = 'SET_USER_DATA';
export const AUTH_ERROR = 'AUTH_ERROR';
export const SET_USERS_DATA= 'SET_USERS_DATA';
export const GET_USERS_DATA= 'GET_USERS_DATA';
export const SAVE_USERS= 'SAVE_USERS';
export const CHECK_ITEMS = 'CHECK_ITEMS';
export const SET_SUCCESS_MSG = 'SET_SUCCESS_MSG';

export class TrySignup implements Action {
  readonly type = TRY_SIGNUP;

  constructor(public payload: {username: string}) {}
}

export class TrySignin implements Action {
  readonly type = TRY_SIGNIN;

  constructor(public payload: {username: string, token: string, name: string, image: string}) {}
}

export class Signup implements Action {
  readonly type = SIGNUP;

  constructor(public payload: string) {}
}

export class Signin implements Action {
  readonly type = SIGNIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SetToken implements Action {
  readonly type = SET_TOKEN;

  constructor(public payload: string) {}
}

export class SetUserData implements Action {
  readonly type = SET_USER_DATA;

  constructor(public payload: {name: string, image: string}) {}
}

export class GetUsers implements Action {
  readonly type = GET_USERS_DATA;

}

export class SetUsers implements Action {
  readonly type = SET_USERS_DATA;

  constructor(public payload: {users: string, mesg: string}) {}
}

export class ErrorAction implements Action {
  readonly type = AUTH_ERROR;
  
  constructor(public payload: any) {}
}

export class SaveUsers implements Action {
  readonly type = SAVE_USERS;

  constructor(public payload: {users: any}) {}
}

export class CheckMissingItems implements Action {
  readonly type = CHECK_ITEMS;

}

export class SetSuccessMessage implements Action {
  readonly type = SET_SUCCESS_MSG;

  constructor(public payload: {msg: string}) {}
}

export type AuthActions = Signup | Signin | Logout | SetToken | TrySignup | TrySignin | SetUserData | ErrorAction | SetUsers | GetUsers | SaveUsers | SetSuccessMessage;
