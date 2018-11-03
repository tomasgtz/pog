import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SalesOrdersFilterComponent } from "./sales-orders-filter/sales-orders-filter.component";
import { SalesOrdersComponent } from "./sales-orders.component";
import { SalesOrdersListComponent } from "./sales-orders-list/sales-orders-list.component";
import { SalesOrdersProcessComponent } from "./sales-orders-process/sales-orders-process.component";

const soRoutes: Routes = [
    { path: '', component: SalesOrdersComponent },
	{ path: 'list', component: SalesOrdersListComponent },
    { path: 'filter', component: SalesOrdersFilterComponent },
	{ path: 'process', component: SalesOrdersProcessComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(soRoutes)
    ],
    exports: [RouterModule]
})
export class SalesOrdersRoutingModule {}