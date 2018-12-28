import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from '@angular/router';
import {map, tap, switchMap, mergeMap, catchError} from 'rxjs/operators';
import { from, Observable, pipe, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as POActions from './po.actions';
import { Provider } from '../../shared/provider.model';
import * as fromApp from '../../store/app.reducers';
import { Store } from '@ngrx/store';
import { PO } from '../../shared/po.model';

@Injectable()
export class POEffects {

  
  @Effect()
  poGetProviders = this.actions$
    .ofType(POActions.GET_PROVIDERS)
    .pipe(switchMap((action: POActions.GetProviders) => {
      
        return this.http.get<Provider[]>('http://192.168.1.122:82/compras/pog/index.php/providers', {
         //return this.http.get<Provider[]>('http://localhost/pog/providers.php', {
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
          
  @Effect()
  savePO = this.actions$
  .ofType(POActions.SAVE_ORDER)
  .pipe(switchMap((action: POActions.SavePurchaseOrder) => {
    
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('cache-control', 'no-cache');
  
    console.log(action.payload);
    return this.http.put(
      'http://192.168.1.122:82/compras/pog/index.php/savePO', 
      JSON.stringify(action.payload), 
      {headers: headers})  
                   
  }), map((response: string) => {
    // reload the list of drafts
    this.store.dispatch(new POActions.GetPODrafts());

    return {
      type: POActions.PO_SAVED_SUCCESSFULLY,
      payload: JSON.parse(response)
    };
  }), catchError(error => this.handleError(error)));



  @Effect()
  poGetPODrafts = this.actions$
    .ofType(POActions.GET_PO_DRAFTS)
    .pipe(switchMap((action: POActions.GetPODrafts) => {
      
        return this.http.get<PO[]>('http://192.168.1.122:82/compras/pog/index.php/po_drafts', {
         //return this.http.get<Provider[]>('http://localhost/pog/providers.php', {
           observe: 'body',
           responseType: 'json'
         });
        }), map((drafts) => {

          return {
            type: POActions.SET_PO_DRAFTS,
            payload: drafts
          };
          
        }
      ), catchError(error => this.handleError(error)));

  
  @Effect()
  poGetPOProcessed = this.actions$
    .ofType(POActions.GET_PO_PROCESSED)
    .pipe(switchMap((action: POActions.GetPOProcessed) => {
       console.log("llamando al rest");
        return this.http.get<PO[]>('http://192.168.1.122:82/compras/pog/index.php/po_processed', {
          //return this.http.get<Provider[]>('http://localhost/pog/providers.php', {
            observe: 'body',
            responseType: 'json'
          });
        }), map((processed: any) => {
          console.log("list rece", processed.error);
          

            if(processed.error !== undefined) {
              return {
                type: POActions.PO_ERROR,
                payload: processed.error
              };
            } else {
              return {
                type: POActions.SET_PO_PROCESSED,
                payload: processed
              };
            }
          
        }
      ), catchError(error => this.handleError(error)));
  constructor(private actions$: Actions, private router: Router, private http: HttpClient, private store: Store<fromApp.AppState>) {}
  
  private handleError(error) {
    console.log(error.error.text);
    return of(new POActions.ErrorAction(error.error.text));
  }
}
