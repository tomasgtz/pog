import { Component, OnInit, Input } from '@angular/core';
import { PO } from '../../shared/po.model';
import { LineItem } from '../../shared/line-item.model';
import { Provider } from '../../shared/provider.model';
import { Observable } from 'node_modules/rxjs';
import * as fromApp from '../../store/app.reducers';
import * as fromPO from '../store/po.reducers';
import * as POActions from '../store/po.actions';
import { Store } from '@ngrx/store';

import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchase-orders-detail',
  templateUrl: './purchase-orders-detail.component.html',
  styleUrls: ['./purchase-orders-detail.component.css']
})
export class PurchaseOrdersDetailComponent implements OnInit {

  @Input() model: { type: string, id: number, columns };
  @Input() list: any[];
  po: PO;
  lineItems: LineItem[] = [];
  public isCollapsed = false;
  poState: Observable<fromPO.State>;
  poForm: FormGroup;
 
  providers: Provider[] = [];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.po = new PO('','',0,'',this.lineItems, '');
    this.poState = this.store.select('po');
    
    this.poState.subscribe((poState: fromPO.State) => {
      this.providers = poState.providers;

    })
    
    
    let date = Date.now();
    this.poForm = new FormGroup({
      'date_created': new FormControl(date, Validators.required),
      'provider': new FormControl('', Validators.required),
      'currency': new FormControl('', Validators.required),
      'buyer': new FormControl('', Validators.required),
      'project': new FormControl('', Validators.required),
      'comments': new FormControl('', Validators.required),
      'sos_included': new FormControl('', Validators.required)
    });

   
    return this.store.dispatch(new POActions.GetProviders(this.providers));
  }


  public isArray(object): boolean {
    return Array.isArray(object);
  }

  public removeItem(item: LineItem, list: LineItem[]): void {
    list.splice(list.indexOf(item), 1);
    console.log(this.providers);
  }

  onSubmit() {

  }
}


