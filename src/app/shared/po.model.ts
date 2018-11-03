import { LineItem } from "./line-item.model";

export class PO {

    constructor(
        public contpaqId: string,
        public provider: string,
        public folio: number,
        public created_date: string,
        public lineItems: LineItem[],
        public status: string
    ) {

        this.contpaqId = contpaqId;
        this.provider = provider;
        this.folio = folio;
        this.created_date = created_date;
        this.lineItems = lineItems;
        this.status = status;
    }
}