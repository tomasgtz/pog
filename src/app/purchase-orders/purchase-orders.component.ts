import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from 'node_modules/@ngrx/store';

import * as fromApp from '../store/app.reducers';
import * as POActions from './store/po.actions';
import { PO } from '../shared/po.model';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})
export class PurchaseOrdersComponent implements OnInit, OnDestroy {

  showDrafts: boolean = true;
  showProcessed: boolean = false;
  
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  show(tab: string){

    if(tab === 'drafts') {
      console.log(tab);

      this.showDrafts = true;
      this.showProcessed = false;
      
    } else {
      this.showDrafts = false;
      this.showProcessed = true;

    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new POActions.SetPO(new PO('0','','','0','',[],'','','draft','','',0))); 
  }

}
