import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from '@angular/router';
import {map, tap, switchMap, mergeMap, catchError} from 'rxjs/operators';
import { from, Observable, pipe, of, throwError } from 'rxjs';
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
        
           observe: 'body',
           responseType: 'json'
         });
        }), map((providers) => {

          return {
            type: POActions.SET_PROVIDERS,
            payload: providers
          };
          
        }
      ), catchError((err,caught) => {
  
        this.store.dispatch(new POActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
        return caught;
     }));
          
  @Effect()
  savePO = this.actions$
  .ofType(POActions.SAVE_ORDER)
  .pipe(switchMap((action: POActions.SavePurchaseOrder) => {
    
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('cache-control', 'no-cache');
  
    
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
  }
  ), catchError((err,caught) => {
  
    this.store.dispatch(new POActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
    return caught;
 }));


  @Effect()
  sendToContpaq = this.actions$
  .ofType(POActions.SEND_CONTPAQ)
  .pipe(switchMap((action: POActions.SendToContpaq) => {

    console.log(action.payload);
    
      return this.http.get(
      'http://192.168.1.122:82/compras/pog/index.php/sendToContpaq?id=' + action.payload, {
            observe: 'body',
            responseType: 'json'
      });

       }), map((response: {id: string, error: string}) => {

        if(undefined !== response.id) {
          return {
            type: POActions.PO_SENT_SUCCESSFULLY,
            payload: response.id
          };
        } else {
          return {
            type: POActions.PO_ERROR,
            payload: response.error
          };
        }

       }
    
       ), catchError((err,caught) => {
  
        this.store.dispatch(new POActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
        return caught;
     }));

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
      ), catchError((err,caught) => {
  
        this.store.dispatch(new POActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
        return caught;
     }));

  
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
      ), catchError((err,caught) => {
  
        this.store.dispatch(new POActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
        return caught;
     }));


  @Effect()
  deletePO = this.actions$
    .ofType(POActions.DELETE_PO)
    .pipe(switchMap((action: POActions.DeletePO) => {

      return this.http.get('http://192.168.1.122:82/compras/pog/index.php/delete_po?id=' + action.payload, {
          observe: 'body',
          responseType: 'json'
        });

    }), map((response: any) => {    
      
      if(response.error !== undefined) {
        return {
          type: POActions.PO_ERROR,
          payload: response.error
        };
      } else if(response.success === "ok"){
        return {
          type: POActions.PO_DELETED_SUCCESSFULLY,
          payload: null
        };
      }
        
    }
  ), catchError((err,caught) => {
  
    this.store.dispatch(new POActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
    return caught;
 }));

  constructor(private actions$: Actions, private router: Router, private http: HttpClient, private store: Store<fromApp.AppState>) {}
  
  
}
