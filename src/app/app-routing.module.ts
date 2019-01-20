import { NgModule } from "@angular/core";
import {  RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { HomeComponent } from "./core/home/home.component";
import { AppGuard } from "./app-guard.service";

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AppGuard] },
    { path: 'sales-orders', loadChildren: './sales-orders/sales-orders.module#SalesOrdersModule'},
    { path: 'purchase-orders', loadChildren: './purchase-orders/purchase-orders.module#PurchaseOrdersModule'},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}