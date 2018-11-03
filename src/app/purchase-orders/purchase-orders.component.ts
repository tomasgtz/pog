import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})
export class PurchaseOrdersComponent implements OnInit {

  showDrafts: boolean = true;
  showProcessed: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

  show(tab: string){

    if(tab === 'drafts') {
      console.log(tab);

      this.showDrafts = true;
      this.showProcessed = false;
      
    } else {
      this.showDrafts = false;
      this.showProcessed = true;

    }
  }

}
