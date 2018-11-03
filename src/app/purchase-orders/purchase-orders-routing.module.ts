import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrdersDraftComponent } from './purchase-orders-draft/purchase-orders-draft.component';
import { PurchaseOrdersSentComponent } from './purchase-orders-sent/purchase-orders-sent.component';


const routes2: Routes = [

    { path: '', component: PurchaseOrdersDraftComponent, outlet: "purhcaseorderoutlet" },
    { path: 'drafts', component: PurchaseOrdersDraftComponent, outlet: "purhcaseorderoutlet" },
    { path: 'sent', component: PurchaseOrdersSentComponent, outlet: "purhcaseorderoutlet" }
    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes2)
    ],
    exports: [
        RouterModule
    ]
})
export class PurchaseOrdersRoutingModule { }