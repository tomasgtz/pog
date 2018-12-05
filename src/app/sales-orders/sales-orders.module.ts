import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SalesOrdersFilterComponent } from "./sales-orders-filter/sales-orders-filter.component";
import { SalesOrdersListComponent } from "./sales-orders-list/sales-orders-list.component";
import { SalesOrdersProcessComponent } from "./sales-orders-process/sales-orders-process.component";
import { SalesOrdersComponent } from "./sales-orders.component";
import { SalesOrdersRoutingModule } from "./sales-orders-routing.module";
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SalesOrdersService } from './sales-orders.service';
import { SOControlPipe, SOCMHPipe, SOEOLPipe, SOSSPipe } from '../shared/un.pipe';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { AuthGuard } from '../auth/auth-guard.service';

@NgModule({
  imports: [
    SalesOrdersRoutingModule,
    AngularFontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PurchaseOrdersModule,
    DndListModule
  ],
  declarations: [
    SalesOrdersComponent,
    SalesOrdersFilterComponent,
    SalesOrdersListComponent,
    SalesOrdersProcessComponent,
    SOControlPipe,
    SOCMHPipe,
    SOEOLPipe,
    SOSSPipe
  ],
  providers: [SalesOrdersService, AuthGuard]
})

export class SalesOrdersModule { }