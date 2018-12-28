import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Order } from '../shared/order.model';
import { Subject } from "node_modules/rxjs";
import { LineItem } from "../shared/line-item.model";

@Injectable()
export class SalesOrdersService {

    orders: Order[] = [];
    salesOrdersChanged = new Subject<Order[]>();

    loadPendingOrders() {
        
        return this.http.get('https://prod-15.southcentralus.logic.azure.com:443/workflows/4b999b7b8e41434db6d5088e35523e8b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0b8VgHUUQLEpKZtThL5sX_0F2-iTNskt9S7YxwCdPiY')
        .pipe(map((response: Response) => {
           
            if(response) {
                
                const mapped = Object.entries(response).map(([type, value]) => ({type, value}));
                
                mapped.forEach(e => {
                    
                    var order = new Order(
                        e.value.id,
                        e.value.unidad_de_negocio_c,
                        e.value.folio_c,
                        e.value.name,
                        e.value.sdi_llc_c,
                        e.value.flete_express_c,
                        e.value.purchase_order_num_c,
                        e.value.proveedor_c,
                        e.value.account_name,
                        e.value.fecha_promesa_entrega_c,
                        e.value.assigned_user_name,
                        e.value.date_modified,
                        e.value.terminos_pago_c,
                        null,
                        false,
                        "unattended"
                    );

                    this.http.get('https://prod-11.southcentralus.logic.azure.com/workflows/e68c1cf592654da18999b01dcf364f43/triggers/manual/paths/invoke/op/' + e.value.folio_c + '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=g_M7MNV-D478AGbvgR5PhefJfwPfzV4QnciT6EzULaE')
                    .subscribe(
                        (response2: Response) => {
                            //console.log("trayendo2");
                            const mapped2 = Object.entries(response2).map(([type, value]) => ({type, value}));
                        
                            if(mapped2) {
                               var items = [];
                               mapped2.forEach(e => {
                                   //console.log(e);
                                   var item: LineItem = new LineItem(                            
                                    e.value.name,
                                    e.value.description,
                                    e.value.quantity,
                                    e.value.comentarios_c,
                                    e.value.cost_price,0,0,false
                                    
                                   )
                                items.push(item); 
                               });
                               order.lineItems = items;
                            }
                        
                        }
                    )
                    this.orders.push(order);
                    
                });
            }
            
            return this.orders;
        }));
   
    }

    getPendingOrders() {
        return this.orders.slice();
    }
    
    

 constructor(private http: HttpClient) {}



}