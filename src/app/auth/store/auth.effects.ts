import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from '@angular/router';
import {map, tap, switchMap, mergeMap} from 'rxjs/operators';
import { from, Observable, pipe } from 'rxjs';
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
      , switchMap((authData: { username: string, password: string }) => {
      return '';
     //   return from(firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password));
      })
      , switchMap(() => {
      return '';
     //   return from(firebase.auth().currentUser.getIdToken());
      })
      , mergeMap((token: string) => {
        return [
          {
            type: AuthActions.SIGNUP
          },
          {
            type: AuthActions.SET_TOKEN,
            payload: token
          }
        ]; 
      }));

  @Effect()
  authSignin = this.actions$
    .ofType(AuthActions.TRY_SIGNIN)
    .pipe(map((action: AuthActions.TrySignin) => {
        return action.payload;
      })
      , switchMap((authData: { username: string, token: string }) => {
        
      let json = JSON.stringify( authData );
      let params = "json=" + json;
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
       
      //return this.http.post('http://192.168.1.122:82/compras/pog/index.php/Authentication', params, {headers: headers})
      return this.http.get('http://localhost/pog/indexp.php')
         .pipe(map((response: Response) => {
         // console.log("response");
         // console.log(response + " " + authData.token);
              
          return {
                authorization: response + "", 
                token: authData.token
              };
          
      }));
    })
      
      , map((responseFromContpaq: { authorization: string, token: string }) => {
       
          if (responseFromContpaq.authorization == '1' && responseFromContpaq.token != '') {
           
            return responseFromContpaq.token;
          }
          
          return 'no token';
      })
      , mergeMap((token: string) => {

        console.log(token);

        if(token !== 'no token') {
          this.router.navigate(['/']);
          return [
            {
              type: AuthActions.SIGNIN
            },
            {
              type: AuthActions.SET_TOKEN,
              payload: token
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

  constructor(private actions$: Actions, private router: Router, private http: HttpClient) {
  }
}
