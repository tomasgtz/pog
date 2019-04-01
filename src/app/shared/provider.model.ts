
export class Provider {

    constructor(
        public contpaqId: string,
        public name: string,
        public cdias: string,
        public currency: string,
        public tax_rate: number    ) {

        this.contpaqId = contpaqId;
        this.name = name;
        this.cdias = cdias;
        this.currency = currency;
        this.tax_rate = tax_rate;
    }
}