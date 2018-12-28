import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from '@angular/router';
import {map, tap, switchMap, mergeMap, catchError} from 'rxjs/operators';
import { from, Observable, pipe, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as AuthActions from './auth.actions';


@Injectable()
export class AuthEffects {

  
  @Effect()
  authSignup = this.actions$
    .ofType(AuthActions.TRY_SIGNUP)
    .pipe(map((action: AuthActions.TrySignup) => {
        return action.payload;
      })
      , switchMap((authData: { username: string }) => {

        
        let json = JSON.stringify( authData );
        let params = "json=" + json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        //console.log(params);
        return this.http.post('http://192.168.1.122:82/compras/pog/index.php/SignUp', params, {headers: headers})
        .pipe(map((response: Response) => {
              console.log(response);
          if(response + "" === "ok") {
            return {
              type: AuthActions.SIGNUP,
              payload: "ok"
            };
          }
          
        }), catchError(error => this.handleError(error)))
      }));

  @Effect()
  poGetPODrafts = this.actions$
    .ofType(AuthActions.GET_USERS_DATA)
    .pipe(switchMap((action: AuthActions.GetUsers) => {
      
        return this.http.get('http://192.168.1.122:82/compras/pog/index.php/users', {
          
            observe: 'body',
            responseType: 'json'
          });
        }), map((users) => {

          return {
            type: AuthActions.SET_USERS_DATA,
            payload: {users: users, mesg: "Users loaded correctly" }
          };
          
        }
      ), catchError(error => this.handleError(error)));


  @Effect()
  savePO = this.actions$
  .ofType(AuthActions.SAVE_USERS)
  .pipe(switchMap((action: AuthActions.SaveUsers) => {
    
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('cache-control', 'no-cache');
  
    return this.http.put( 'http://192.168.1.122:82/compras/pog/index.php/saveUsers', 
      JSON.stringify(action.payload), 
      {headers: headers})  
                    
    }), map((users) => {
      
      return {
        type: AuthActions.SET_USERS_DATA,
        payload: {users: users, mesg: "Users saved correctly" }
      } ;
  }), catchError(error => this.handleError(error)));
    

  @Effect()
  authSignin = this.actions$
    .ofType(AuthActions.TRY_SIGNIN)
    .pipe(map((action: AuthActions.TrySignin) => {
        return action.payload;
      })
      , switchMap((authData: { username: string, token: string, name: string, image: string }) => {
        
      let json = JSON.stringify( authData );
      let params = "json=" + json;
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
      return this.http.post('http://192.168.1.122:82/compras/pog/index.php/Authentication', params, {headers: headers})
      //return this.http.get('http://localhost/pog/index.php')
         .pipe(map((response: Response) => {
                   
          return {
                authorization: response + "", 
                token: authData.token,
                name: authData.name,
                image: authData.image
              };
          
      }));
    })
      
      , map((responseFromContpaq: { authorization: string, token: string, name:string, image:string }) => {
       
          if (responseFromContpaq.authorization == '1' && responseFromContpaq.token != '') {
           
            return responseFromContpaq;
          }

          responseFromContpaq.authorization = 'no token';
          
          return responseFromContpaq;
      })
      , mergeMap((responseFromContpaq: {authorization: string, token: string, name: string, image: string}) => {

        if(responseFromContpaq.token !== 'no token') {
          this.router.navigate(['/']);
          return [
            {
              type: AuthActions.SIGNIN
            },
            {
              type: AuthActions.SET_TOKEN,
              payload: responseFromContpaq.token
            },
            {
              type: AuthActions.SET_USER_DATA,
              payload: {name: responseFromContpaq.name, image: responseFromContpaq.image}
            }
          ];
        } else {
          this.router.navigate(['/auth/signin']);
          return [
            {
              type: AuthActions.LOGOUT
            }];
        }
      })); 

  @Effect({dispatch: false})
  authLogout = this.actions$
    .ofType(AuthActions.LOGOUT)
    .pipe(tap(() => {
      this.router.navigate(['/auth/signin']);
    }));

  @Effect()
  checkMissingItems = this.actions$
  .ofType(AuthActions.CHECK_ITEMS)
  .pipe(switchMap((action: AuthActions.CheckMissingItems) => {
    
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('cache-control', 'no-cache');
  
    return this.http.get('http://192.168.1.122:82/compras/pog/index.php/checkProductsInContpaq', {
          observe: 'body',
          responseType: 'json'
        });
      }), map((response) => {

        return {
          type: AuthActions.SET_SUCCESS_MSG,
          payload: { msg: response }
        };
        
      }), catchError(error => this.handleError(error)));
  

  constructor(private actions$: Actions, private router: Router, private http: HttpClient) {}


  private handleError(error) {
    console.log(error);
    return of(new AuthActions.ErrorAction(error.error.text));
  }
}
