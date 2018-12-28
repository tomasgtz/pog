import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './core/home/home.component';
import { SalesOrdersModule } from './sales-orders/sales-orders.module';

import { SalesOrdersListComponent } from './sales-orders/sales-orders-list/sales-orders-list.component';
import { SalesOrdersProcessComponent } from './sales-orders/sales-orders-process/sales-orders-process.component';
import { SalesOrdersFilterComponent } from './sales-orders/sales-orders-filter/sales-orders-filter.component';


import { AuthEffects } from './auth/store/auth.effects';
import { POEffects } from './purchase-orders/store/po.effects';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SOEffects } from './sales-orders/store/so.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
	  AppRoutingModule,
	  HttpModule,
    AuthModule,
    SharedModule,
    SalesOrdersModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects, POEffects, SOEffects]),
    StoreRouterConnectingModule,
    AngularFontAwesomeModule,
    PDFExportModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    BrowserAnimationsModule
  ]
})
export class AppModule { }
