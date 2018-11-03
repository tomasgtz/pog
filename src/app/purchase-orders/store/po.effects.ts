import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from '@angular/router';
import {map, tap, switchMap, mergeMap} from 'rxjs/operators';
import { from, Observable, pipe } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as POActions from './po.actions';
import { Provider } from '../../shared/provider.model';
import * as fromApp from '../../store/app.reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class POEffects {

  
  @Effect()
  poGetProviders = this.actions$
    .ofType(POActions.GET_PROVIDERS)
    .pipe(switchMap((action: POActions.GetProviders) => {
      
        //return this.http.get('http://192.168.1.122:82/compras/pog/index.php/providers').pipe(map((response: Response) => {
         return this.http.get<Provider[]>('http://localhost/pog/providers.php', {
           observe: 'body',
           responseType: 'json'
         });
        }), map((providers) => {

          return {
            type: POActions.SET_PROVIDERS,
            payload: providers
          };
          
        }
      ));
          
  

  constructor(private actions$: Actions, private router: Router, private http: HttpClient, private store: Store<fromApp.AppState>) {
  }
}
