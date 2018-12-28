import { Component, OnInit } from '@angular/core';
import { Observable, of } from '../../../../node_modules/rxjs';

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
export class SalesOrdersProcessComponent implements OnInit {
  order: Order;
  soState: Observable<fromSO.State>;
  selectAll: boolean = false;
  list: LineItem[] = [];
  
  
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.soState = this.store.select('so');
    
    this.soState.subscribe((soState: fromSO.State) => {
      this.order = soState.selected_order;
      
      of(this.order).subscribe(order => {
        //console.log("Carga orden y limpia this list");
        this.selectAll = false;
        this.list = [];
      });
    })
  }

  selectAllChecks(f: NgForm) {

    if(this.selectAll) {
      //console.log("Entra a limpiar");
      Object.keys(f.form.controls).forEach(key => {
        f.form.get(key).setValue(false);
      });
      this.list = [];
    } else {
      Object.keys(f.form.controls).forEach(key => {
        f.form.get(key).setValue(true);
      });
      
      this.list = this.order.lineItems.map(x => Object.assign({}, x));

    }

    this.selectAll = !this.selectAll;
    
  }

  updateList(i, item) {

    console.log("item selected " , item.selected);
    if(item.selected === undefined) {
      item.selected = false;
    }
    
    if(item.selected === false) {
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

    console.log("despues de agregar un item" , this.list);

  }

  onSubmit() {
    //console.log("send items", this.list);
    let list2 = this.list.map(x => Object.assign({}, x));

    //console.log(list2);

    console.log("this.list" , this.list.length, "this.order.lineItems", this.order.lineItems.length)
    if(this.list.length == this.order.lineItems.length) {
      this.order.status = "attended";
    } else {
      this.order.status = "attendedp"
    }

    this.store.dispatch(new SOActions.SetItemsToTransfer(list2));

    
    

    //console.log("this list after store", this.list);
    /*this.list.forEach((item) => {

      let id = this.order.lineItems.findIndex(itemOfOrder => (item.model === itemOfOrder.model));
      if(id !== -1) {
        this.order.lineItems.splice(id, 1);
      }

    });*/
  }

}
