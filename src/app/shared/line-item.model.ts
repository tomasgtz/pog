
export class LineItem {

    constructor(
        public model: string,
        public description: string,
        public quantity: number,
        public comments: string,
        public cost: number,
        public status: number,
        public oc: number,
        public lineSelected: boolean = false
    ) {

        this.model = model;
        this.description = description;
        this.quantity = quantity;
        this.comments = comments;
        this.cost = cost;
        this.status = 0;
        this.oc = oc;
        this.lineSelected = lineSelected;
    }
}