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

  constructor(private actions$: Actions, private router: Router, private http: HttpClient) {
  }
}
