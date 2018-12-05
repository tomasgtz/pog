import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {map} from 'rxjs/operators';

import * as SOActions from './so.actions';


@Injectable()
export class SOEffects {
    constructor(private actions$: Actions) {}
  /*
  @Effect()
  soUpdateFilters = this.actions$
    .ofType(SOActions.UPDATE_SEARCH_FILTERS)
    .pipe(map((action: SOActions.UpdateSearchFilters) => {
        return {type: SOActions.UPDATE_SEARCH_FILTERS, payload: action.payload };
      })
    );*/

    /*  
  @Effect()
  soSelectOrder = this.actions$
    .ofType(SOActions.SELECT_ORDER)
    .pipe(map((action: SOActions.SelectOrder) => {
        return {
          type: SOActions.SELECT_ORDER,
          payload: action.payload
      };
    }));
*/
      
}
