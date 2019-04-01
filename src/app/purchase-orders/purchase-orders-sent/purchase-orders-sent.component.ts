import { Component, OnInit } from '@angular/core';
import { PO } from '../../shared/po.model';
import { Observable, of } from '../../../../node_modules/rxjs';
import { Provider } from '../../shared/provider.model';
import * as fromApp from '../../store/app.reducers';
import * as fromPO from '../store/po.reducers';
import * as POActions from '../store/po.actions';
import { Store } from '../../../../node_modules/@ngrx/store';


@Component({
  selector: 'app-purchase-orders-sent',
  templateUrl: './purchase-orders-sent.component.html',
  styleUrls: ['./purchase-orders-sent.component.css']
})
export class PurchaseOrdersSentComponent implements OnInit {

  processed: PO[];
  poState: Observable<fromPO.State>;
  
  providers: Provider[];
  error;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.poState = this.store.select('po');
    this.poState.subscribe((poState: fromPO.State) => {
      this.processed = poState.processed;
      this.providers = poState.providers;
      this.error = poState.error;

      // load provider name from list of providers
     of(this.providers).subscribe((provs: Provider[]) => {
      of(this.processed).subscribe( (processed: PO[]) => {
      
        if(undefined != this.processed && this.providers != undefined) {
          processed.forEach( function(draft) {          
            const provider2 = provs.filter(provider => (provider.contpaqId === draft.provider ));
            if(undefined !== provider2[0]) {
              draft.provider_name = provider2[0].name;
            }
          });
        }
  
      })
     });

      
    });   
    
    this.store.dispatch(new POActions.GetPOProcessed());
  }

  closeAlert() {
    this.error = '';
  }

  selectProcessed(processed: PO){
    this.store.dispatch(new POActions.SetPO(processed)); 
  }

  createNewPO(){
    this.store.dispatch(new POActions.SetPO(new PO('0','','','0','',[],'','','draft','','',0,''))); 
  }

}
