import { LineItem } from "./line-item.model";

export class Order {

    constructor(
        public sugarId: string,
        public unidad_de_negocio_c: string,
        public folio_c: number,
        public name: string,
        public sdi_llc_c: boolean,
        public flete_express_c: boolean,
        public purchase_order_num_c: string,
        public proveedor_c: string,
        public account_name: string,
        public fecha_promesa_entrega_c: string,
        public assigned_user_name: string,
        public date_modified: string,
        public credit: string,
        public lineItems: LineItem[]
    ) {

        this.sugarId = sugarId;
        this.unidad_de_negocio_c = unidad_de_negocio_c;
        this.folio_c = folio_c;
        this.name = name;
        this.sdi_llc_c = sdi_llc_c;
        this.flete_express_c =flete_express_c;
        this.purchase_order_num_c = purchase_order_num_c;
        this.proveedor_c = proveedor_c;
        this.account_name = account_name;
        this.fecha_promesa_entrega_c = fecha_promesa_entrega_c;
        this.assigned_user_name = assigned_user_name;
        this.date_modified = date_modified;
        this.credit = credit;
        this.lineItems = lineItems;
        
    }
}