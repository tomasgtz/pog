import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';

import { Order } from '../../shared/order.model';
import { LineItem } from '../../shared/line-item.model';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as fromSO from '../store/so.reducers';
import * as SOActions from '../store/so.actions';



@Component({
  selector: 'app-sales-orders-process',
  templateUrl: './sales-orders-process.component.html',
  styleUrls: ['./sales-orders-process.component.css']
})
export class SalesOrdersProcessComponent implements OnInit {
  order: Order;
  soState: Observable<fromSO.State>;
  
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.soState = this.store.select('so');
    
    this.soState.subscribe((soState: fromSO.State) => {
      this.order = soState.selected_order;
      //console.log(this.filters);
    })
  }

  public removeItem(item: LineItem, list: LineItem[]): void {
    list.splice(list.indexOf(item), 1);
  }


}
