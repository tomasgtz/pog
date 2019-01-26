import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Observable, of, Subscription } from '../../../../node_modules/rxjs';

import { Order } from '../../shared/order.model';
import { LineItem } from '../../shared/line-item.model';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as fromSO from '../store/so.reducers';
import * as SOActions from '../store/so.actions';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-sales-orders-process',
  templateUrl: './sales-orders-process.component.html',
  styleUrls: ['./sales-orders-process.component.css']
})
export class SalesOrdersProcessComponent implements OnInit, OnDestroy {
  
  order: Order;
  soState: Observable<fromSO.State>;
  selectAll: boolean = false;
  list: LineItem[] = [];
  subscription_soState: Subscription;
  btnDisabled: boolean = false;

  observable_order: Observable<Order>;
  subscription_order: Subscription;
  
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.soState = new Observable();
    this.selectAll = false;
    this.list = [];
    this.order = null;
      
    this.subscription_soState.unsubscribe();
    this.subscription_order.unsubscribe();
    
    this.store.dispatch(new SOActions.SetItemsToTransfer([]));

  }

  ngOnInit() {
    this.soState = this.store.select('so');
    
    this.subscription_soState = this.soState.subscribe((soState: fromSO.State) => {
      this.order = soState.selected_order;
      this.observable_order = of(this.order);

      this.subscription_order = this.observable_order.subscribe(order => {
        this.selectAll = false;
        this.list = [];
      });
      
      if(this.order) {
        this.order.selectedAll = false;
      }

      if(this.order && this.order.lineItems) {
        this.order.lineItems.forEach(item => {
          item.lineSelected = false;
        });
      }
    })
  }

  selectAllChecks(f: NgForm) {

    if(this.selectAll) {

      Object.keys(f.form.controls).forEach((key,index) => {
        f.form.get(key).setValue(false);
        
        if(key != 'chkAll') {
          
          this.order.lineItems[index-1].lineSelected = false;
        
        }
        
      });
      this.list = [];
    } else {
      Object.keys(f.form.controls).forEach((key,index) => {
        f.form.get(key).setValue(true);
        
        if(key != 'chkAll') {
  
          this.order.lineItems[index-1].lineSelected = true;
        }
        
      });
      
      this.list = this.order.lineItems.map(x => Object.assign({}, x));

    }

    this.selectAll = !this.selectAll;
    
  }

  updateList(i, item) {
    
    if(item.lineSelected === undefined) {
      item.lineSelected = true;
    }

    if(item.lineSelected === false) {

      const id = this.list.findIndex(itemOfList => (item.model === itemOfList.model));
      const id2 = this.order.lineItems.findIndex(itemOfOrder => (item.model === itemOfOrder.model));
      
      if(id === -1) {
        this.order.lineItems[id2].lineSelected = true;
        let it = this.order.lineItems.slice(id2, id2 + 1)[0];
        this.list.push(it);
      }
      
    } else {

      let id = this.list.findIndex(itemOfList => (item.model === itemOfList.model));
      this.list.splice(id, 1);
    }

  }

  onSubmit() {

    let list2 = this.list.map(x => Object.assign({}, x));

    list2.forEach((item, idx) => {
      if(item.model == 'YV-FLETE' || item.model == 'YV-INSTAL') {
        list2.splice(idx, 1);
      }


    });

    if(list2.length > 0) {
      if(this.list.length == this.order.lineItems.length) {
        this.btnDisabled = true;
      } 
  
      this.store.dispatch(new SOActions.SetItemsToTransfer(list2));

      
    }
   
  }

}