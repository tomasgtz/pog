import { LineItem } from "./line-item.model";

export class PO {

    constructor(
        public id: string,
        public provider: string,
        public provider_name: string,
        public folio: string,
        public created_date: any,
        public lineItems: LineItem[],
        public currencyId: string,
        public comments: string,
        public status: string,
        public project: string,
        public creator: string,
        public subtotal: number,
        public payment_terms: string
        
    ) {

        this.id = id;
        this.provider = provider;
        this.provider_name = provider_name;
        this.folio = folio;
        this.created_date = created_date;
        this.lineItems = lineItems;
        this.currencyId = currencyId;
        this.comments = comments;
        this.status = status;
        this.project = project;
        this.creator = creator;
        this.subtotal = subtotal;
        this.payment_terms = payment_terms;
    }
}