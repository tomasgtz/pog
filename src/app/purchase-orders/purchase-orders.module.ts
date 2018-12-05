import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PurchaseOrdersDetailComponent } from './purchase-orders-detail/purchase-orders-detail.component';
import { PurchaseOrdersDraftComponent } from './purchase-orders-draft/purchase-orders-draft.component';
import { PurchaseOrdersComponent } from './purchase-orders.component';
import { PurchaseOrdersSentComponent } from './purchase-orders-sent/purchase-orders-sent.component';
import { PurchaseOrdersRoutingModule } from './purchase-orders-routing.module';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule, MatInputModule, MatNativeDateModule } from '../../../node_modules/@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PurchaseOrdersRoutingModule,
    DndListModule,
    SharedModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  declarations: [
    PurchaseOrdersDetailComponent,
    PurchaseOrdersDraftComponent,
    PurchaseOrdersComponent,
    PurchaseOrdersSentComponent
  ],
  providers: [],
  exports: [
    PurchaseOrdersComponent,
    PurchaseOrdersDetailComponent,
    PurchaseOrdersRoutingModule
  ]
})

export class PurchaseOrdersModule { }
