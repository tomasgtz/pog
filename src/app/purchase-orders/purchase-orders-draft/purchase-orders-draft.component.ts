import { Component, OnInit } from '@angular/core';
import { PO } from '../../shared/po.model';
import { Observable, of } from '../../../../node_modules/rxjs';
import { Provider } from '../../shared/provider.model';
import * as fromApp from '../../store/app.reducers';
import * as fromPO from '../store/po.reducers';
import * as POActions from '../store/po.actions';
import { Store } from '../../../../node_modules/@ngrx/store';



@Component({
  selector: 'app-purchase-orders-draft',
  templateUrl: './purchase-orders-draft.component.html',
  styleUrls: ['./purchase-orders-draft.component.css']
})
export class PurchaseOrdersDraftComponent implements OnInit {
  drafts: PO[];
  poState: Observable<fromPO.State>;
  
  providers: Provider[];
  error;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.poState = this.store.select('po');
    this.poState.subscribe((poState: fromPO.State) => {
      this.drafts = poState.drafts;
      this.providers = poState.providers;
      this.error = poState.error;

      // load provider name from list of providers
     of(this.providers).subscribe((provs: Provider[]) => {
      of(this.drafts).subscribe( (drafts: PO[]) => {
      
        if(undefined != this.drafts && this.providers != undefined) {
          drafts.forEach( function(draft) {          
            const provider2 = provs.filter(provider => (provider.contpaqId === draft.provider ));
            if(undefined !== provider2[0]) {
              draft.provider_name = provider2[0].name;
            }
          });
        }
  
      })
     });

      
    });   

    this.store.dispatch(new POActions.GetPODrafts());
  }

  closeAlert() {
    this.error = '';
  }

  selectDraft(draft: PO){
    this.store.dispatch(new POActions.SetPO(draft)); 
  }

  createNewPO(){
    this.store.dispatch(new POActions.SetPO(new PO('0','','','0','',[],'','','draft','','',0,''))); 
  }

}
