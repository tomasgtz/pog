import { Component, OnInit } from '@angular/core';
import { PO } from '../../shared/po.model';

@Component({
  selector: 'app-purchase-orders-draft',
  templateUrl: './purchase-orders-draft.component.html',
  styleUrls: ['./purchase-orders-draft.component.css']
})
export class PurchaseOrdersDraftComponent implements OnInit {

  drafts: PO[];

  constructor() { }

  ngOnInit() {
    this.drafts = null;
  }

}
