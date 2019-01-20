
export class LineItem {

    constructor(
        public model: string,
        public description: string,
        public quantity: number,
        public comments: string,
        public cost: number,
        public subtotal: number,
        public status: number,
        public oc: string,
        public lineSelected: boolean = false
    ) {

        this.model = model;
        this.description = description;
        this.quantity = quantity;
        this.comments = comments;
        this.cost = cost;
        this.subtotal = subtotal;
        this.status = 0;
        this.oc = oc;
        this.lineSelected = lineSelected;
    }
}