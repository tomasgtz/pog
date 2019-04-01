import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import * as SOActions from './so.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import * as fromApp from '../../store/app.reducers';
import * as fromSO from '../../sales-orders/store/so.reducers';
import { Store } from '@ngrx/store';


@Injectable()
export class SOEffects {

  soState;
  so;

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {
      this.soState = this.store.select('so');
      this.soState.subscribe((state: fromSO.State) => {
        this.so = state.selected_order;
      });

    }
 

@Effect()
checkOrderStatus = this.actions$
    .ofType(SOActions.CHECK_SO_STATUS)
    .pipe(switchMap((action: SOActions.CheckSOStatus) => {
      
      let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('cache-control', 'no-cache');
      
      
      const prods = this.so.lineItems;
      const prods2 = [];
      prods.forEach((i) => {
        prods2.push(i.model);
      });

      const body2 = new HttpParams()
      .set("folio", this.so.folio_c.toString())
      .set("products", JSON.stringify(prods2));

      return this.http.post(
        'http://192.168.1.122:82/compras/pog/index.php/check_crm', 
        body2.toString(), 
      {headers}); 
     
     
  }), map((response: any) => {       

    //console.log(response);
    
    if(response.error !== undefined) {
      return {
        type: SOActions.SO_ERROR,
        payload: response.success
      };
    } 
    
      
  }
), catchError((err,caught) => {
  
  this.store.dispatch(new SOActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
  return caught;
}));
      

@Effect()
setOrderAsComplete = this.actions$
    .ofType(SOActions.SO_AS_COMPLETE)
    .pipe(switchMap((action: SOActions.SetOrderAsComplete) => {
      
      let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('cache-control', 'no-cache');

      const body2 = new HttpParams()
      .set("folio", this.so.folio_c.toString());

      return this.http.post(
        'http://192.168.1.122:82/compras/pog/index.php/set_order_as_complete', 
        body2.toString(), 
      {headers}); 
     
     
  }), map((response: any) => {       

    console.log(response);
    
    if(response.error !== undefined) {
      return {
        type: SOActions.SO_ERROR,
        payload: response.success
      };
    } else {
      return {
        type: SOActions.SO_SUCCESS,
        payload: "Order saved as completed"
      };
    }
    
      
  }
), catchError((err,caught) => {
  
  this.store.dispatch(new SOActions.ErrorAction(err.error.error + " txt " + err.error.text)); 
  return caught;
}));

}
