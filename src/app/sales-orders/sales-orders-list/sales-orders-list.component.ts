import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { SalesOrdersService } from '../sales-orders.service';
import { Subscription, timer } from 'rxjs';
import { Observable } from 'rxjs';

import { Order } from '../../shared/order.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as fromSO from '../store/so.reducers';
import * as SOActions from '../store/so.actions';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, flatMap } from 'rxjs/operators';

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

  constructor(private salesOrdersService: SalesOrdersService, private store: Store<fromApp.AppState>, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    
    this.subscription = timer(100, 60 * 1000).pipe(tap(v => this.spinner.show()), flatMap(() => this.salesOrdersService.loadPendingOrders()) ).subscribe(
      (orders: Order[]) => {
      
        this.orders = orders;
        this.spinner.hide();
      });

    this.orders = this.salesOrdersService.getPendingOrders();
    this.soState = this.store.select('so');
    
    this.soState.subscribe((soState: fromSO.State) => {
      this.filters = soState.checks;
      //console.log(this.filters);
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.orders = [];
    this.filters = null;
    return this.store.dispatch(new SOActions.SelectOrder(null));
  }


  selectOrder(order: Order) {
    
    return this.store.dispatch(new SOActions.SelectOrder(order));
    
  }

  reload() {
    this.ngOnInit();
  }

}
