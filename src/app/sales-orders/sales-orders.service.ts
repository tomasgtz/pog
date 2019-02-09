import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
                this.orders = [];
                const mapped = Object.entries(response).map(([type, value]) => ({type, value}));
                
                mapped.forEach(e => {
                    console.log(e.value);
                    let projectId = "";
                    let incluir = true;

                    // get PROJECT ID
                    if((e.value.name+"").toLocaleUpperCase().substring(0,3) === "PRY") {
                        projectId = e.value.folio_c;
                    }
                    // not include orders 100 Orden but not payment is confirmed
                    if(e.value.terminos_pago_c == "100_Orden" && e.value.pagado_c == false ) {
                        incluir = false;
                    }
                    
                    // allow orders less than 2500 USD even if not payment is confirmed
                    if(e.value.terminos_pago_c == "100_Orden" && parseInt(e.value.subtotal_descontado_c) < 2500 ) {
                        incluir = true;
                    }

                    // allow orders WEB with metodo_pago_c = 04()Tarjeta_Debito or 28(Tarjeta_Credito)
                    if((e.value.name+"").toUpperCase().includes("WEB") && (e.value.metodo_pago_c == "Tarjeta_Debito" || e.value.metodo_pago_c == "Tarjeta_Credito")) {
                        incluir = true;
                    }

                    // not show on HOLD
                    if(e.value.etapa_c == "on_hold" || e.value.etapa_c == "cancelado") {
                        incluir = false;
                    }

                    if(e.value.date_processed_c == "" && e.value.etapa_principal_c == "ganada" && incluir) {
                    
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
                            "unattended", 
                            projectId,
                            0
                        );

                       if(e.value.sdi_llc_c === true) {
                        order.unidad_de_negocio_c = 'CMH';
                       }

                        this.http.get('https://prod-11.southcentralus.logic.azure.com/workflows/e68c1cf592654da18999b01dcf364f43/triggers/manual/paths/invoke/op/' + e.value.folio_c + '?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=g_M7MNV-D478AGbvgR5PhefJfwPfzV4QnciT6EzULaE')
                        .subscribe(
                            (response2: Response) => {
                                //console.log("trayendo2");
                                const mapped2 = Object.entries(response2).map(([type, value]) => ({type, value}));
                            
                                if(mapped2) {
                                var items = [];
                                var order_subtotal = 0;
                                mapped2.forEach(i => {
                                    //console.log(e);
                                    var item: LineItem = new LineItem(                            
                                        i.value.name,
                                        i.value.description,
                                        i.value.quantity,
                                        i.value.comentarios_c,
                                        i.value.cost_price,
                                        i.value.cost_price * i.value.quantity,
                                        0,
                                        e.value.folio_c,
                                        false
                                    )
                                    items.push(item); 
                                    order_subtotal += item.quantity * item.cost;

                                });
                                order.lineItems = items;
                                order.subtotal = order_subtotal;

                                let headers = new HttpHeaders()
                                    .set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('cache-control', 'no-cache');

                                    const body2 = new HttpParams()
                                    .set("crm", JSON.stringify(order));
                            
                                    this.http.post("http://192.168.1.122:82/compras/pog/index.php/saveCRM", body2.toString(), {headers}).subscribe(
                                        (response2: Response) => {

                                        
                                        });

                                }
                            
                            }
                        )

                        this.http.get('http://192.168.1.122:82/compras/pog/index.php/get_so_status?folio=' + order.folio_c)
                        .subscribe(
                            (response2: any) => {

                                    if(response2 != null && response2.success !== undefined) {
                                        //console.log(order.folio_c, response2.success);
                                        order.status = response2.success;
                                        
                                    }
                                });
                            
                        
                        this.orders.push(order);
                    }
                    
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