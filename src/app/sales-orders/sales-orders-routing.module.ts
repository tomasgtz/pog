import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SalesOrdersFilterComponent } from "./sales-orders-filter/sales-orders-filter.component";
import { SalesOrdersComponent } from "./sales-orders.component";
import { SalesOrdersListComponent } from "./sales-orders-list/sales-orders-list.component";
import { SalesOrdersProcessComponent } from "./sales-orders-process/sales-orders-process.component";
import { AuthGuard } from "../auth/auth-guard.service";

const soRoutes: Routes = [
    { path: '', component: SalesOrdersComponent, canActivate: [AuthGuard] },
	{ path: 'list', component: SalesOrdersListComponent },
    { path: 'filter', component: SalesOrdersFilterComponent },
	{ path: 'process', component: SalesOrdersProcessComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild(soRoutes)
    ],
    exports: [RouterModule]
})
export class SalesOrdersRoutingModule {}