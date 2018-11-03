import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { SalesOrdersService } from '../sales-orders.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

import { Order } from '../../shared/order.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as fromSO from '../store/so.reducers';
import * as SOActions from '../store/so.actions';


@Component({
  selector: 'app-sales-orders-list',
  templateUrl: './sales-orders-list.component.html',
  styleUrls: ['./sales-orders-list.component.css']
})
export class SalesOrdersListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  orders: Order[] = [];
  filters;
  soState: Observable<fromSO.State>;

  constructor(private salesOrdersService: SalesOrdersService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.subscription = this.salesOrdersService.loadPendingOrders().subscribe(
      (orders: Order[]) => {

        this.orders = orders;
      }
    )

    this.orders = this.salesOrdersService.getPendingOrders();
    this.soState = this.store.select('so');
    
    this.soState.subscribe((soState: fromSO.State) => {
      this.filters = soState.checks;
      //console.log(this.filters);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  selectOrder(order: Order) {
    
    return this.store.dispatch(new SOActions.SelectOrder(order));
    
  }

}
