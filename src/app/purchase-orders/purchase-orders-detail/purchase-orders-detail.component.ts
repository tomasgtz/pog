import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { PO } from '../../shared/po.model';
import { LineItem } from '../../shared/line-item.model';
import { Provider } from '../../shared/provider.model';
import { Observable, of, Subscription } from 'node_modules/rxjs';
import * as fromApp from '../../store/app.reducers';
import * as fromPO from '../store/po.reducers';
import * as POActions from '../store/po.actions';
import * as SOActions from '../../sales-orders/store/so.actions';
import * as fromSO from '../../sales-orders/store/so.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import { Store } from '@ngrx/store';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { map, startWith } from '../../../../node_modules/rxjs/operators';

import { CheckInventoryService } from '../../shared/check-inventory.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { DatePipe } from '@angular/common';
import { isDate } from 'util';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../moment.adapter';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-purchase-orders-detail',
  templateUrl: './purchase-orders-detail.component.html',
  styleUrls: ['./purchase-orders-detail.component.css'],
  providers: [
    
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter }
    ]
})
export class PurchaseOrdersDetailComponent implements OnInit, OnDestroy {

  po: PO;
  lineItems: LineItem[] = [];
  public isCollapsed = false;
  poState: Observable<fromPO.State>;
  soState: Observable<fromSO.State>;
  authState: Observable<fromAuth.AuthState>;
  poForm: FormGroup;
  providerCtrl = new FormControl();
  providers: Provider[];
  providersO: Observable<Provider[]>;
  currencies = [{id:'1', name:'MXN'},{id:'2', name:'USD'},{id:'3', name:'EUR'}];
  error;
  success: string;
  success_items_reserved: string;
  poLineItems: FormArray = new FormArray([]);
  //providers2: Provider[];
  username: string = '';
  items_to_transfer:LineItem[] = [];
  projectIdFromSalesOrder: string;
  subtotal: number = 0;
  observable_items_to_transfer: Observable<any>;
  subscription_items_to_transfer: Subscription;
  subscription_soState: Subscription;
  subscription_poState: Subscription;
  observable_lineItems: Observable<any>;
  subscription_lineItems: Subscription;
  tax_rate: number;

  constructor(private store: Store<fromApp.AppState>,   private invService: CheckInventoryService, private datepipe: DatePipe) { }

  ngOnDestroy(): void {
    this.isCollapsed = false;
    this.lineItems = [];
    
    this.subtotal = 0;
    
    this.po = new PO('','','','0','',this.lineItems, '0', '','draft','',this.username,0,'');
    
    this.error = null;
    this.success = null;
    this.observable_items_to_transfer = new Observable();
    this.subscription_items_to_transfer.unsubscribe();
    this.subscription_soState.unsubscribe();
    this.subscription_poState.unsubscribe();
    this.subscription_lineItems.unsubscribe();
    this.soState = new Observable();
    this.poState = new Observable();
  }

  ngOnInit() {

    this.authState = this.store.select('auth');
    this.authState.subscribe((authState: fromAuth.AuthState) => {
      this.username = authState.name;
    });
  
    this.poForm = new FormGroup({
      'id':           new FormControl(null),
      'date_created': new FormControl( new Date() , Validators.required),
      'currencyId':   new FormControl(2, Validators.required),
      'buyer':        new FormControl(this.username, Validators.required),
      'project':      new FormControl(null),
      'comments':     new FormControl(null),
      'sos_included': new FormControl(null)
    });

    this.providerCtrl = new FormControl('', Validators.required);
    this.poForm.addControl('provider', this.providerCtrl);

    this.soState = this.store.select('so');
    this.subscription_soState = this.soState.subscribe((soState: fromSO.State) => {
      this.items_to_transfer = soState.items_to_transfer;
      this.observable_items_to_transfer = of(this.items_to_transfer);

      this.subscription_items_to_transfer = this.observable_items_to_transfer.subscribe( (items) => {
        
        if(null != items && items.length > 0) {
          
          let sos_included = this.poForm.get('sos_included').value;
          
          if(null === sos_included || '' === sos_included) {
            this.poForm.get('sos_included').setValue( items[0].oc);
          } else {
            this.poForm.get('sos_included').setValue( sos_included + '/' + items[0].oc);
          }

          let items2 = items.map(x => Object.assign({}, x));
          
          items2.forEach((item: LineItem) => {
            this.addItem2(item);
          });
          
          this.store.select('so');
          this.store.dispatch(new SOActions.SetItemsToTransfer([]));
        }
  
      });

    });

    this.po = new PO('','','','0','',this.lineItems, '0', '','draft','',this.username,0,'');
    this.poState = this.store.select('po');

    this.subscription_poState = this.poState.subscribe((poState: fromPO.State) => {
     
      this.providers = poState.providers;
      this.providersO = this.poForm.get('provider').valueChanges.pipe(startWith(''), map(value => this._filter(value)));
      this.poForm.get('id').setValue(poState.po.id + "");

      this.poForm.get('project').setValue(poState.po.project);

      if(poState.po.created_date instanceof Object) {
        
        this.poForm.get('date_created').setValue( poState.po.created_date );
      } else if(undefined !== poState.po.created_date && !isDate(poState.po.created_date)) {
        this.poForm.get('date_created').setValue( poState.po.created_date.substring(0,10) );
      } 
      
      this.poForm.get('provider').setValue(this.searchProviderName(poState.po.provider));
      this.poForm.get('currencyId').setValue(this.searchCurrencyName(poState.po.currencyId ));
      this.tax_rate = this.searchProviderTaxRate(poState.po.provider_name);
      
      if(poState.po.creator !== undefined && poState.po.creator !== '') {
        this.poForm.get('buyer').setValue(poState.po.creator);
      }
      
      this.poForm.get('comments').setValue(poState.po.comments);
      
      this.po = poState.po;
      this.lineItems = poState.po.lineItems;
      
      this.error = poState.error;
      this.success = poState.success;
      this.subtotal = this.po.subtotal;
      this.observable_lineItems = of(this.lineItems);
      
      this.subscription_lineItems = this.observable_lineItems.subscribe( (items) => {
        
        this.poLineItems = new FormArray([]);

        if(null != items) {
          
          items.forEach((item: LineItem) => {
          
            let row = new FormGroup({
              'model':    new FormControl(item.model),
              'quantity': new FormControl(item.quantity),
              'comments': new FormControl(item.comments)
            });

            this.poLineItems.push(row);  
          });
       
          
        }

        this.poForm.removeControl('poLineItems');     
          this.poForm.addControl('poLineItems', this.poLineItems);
          this.calcTotal();
      
      });

    });
  
    return this.store.dispatch(new POActions.GetProviders());
  }


  private _filter(value: String): Provider[] {
    if(value == null) {
      value = '';
    }
    
    const filterValue = value.toString().toLowerCase();
    
    return this.providers.filter(option => option.name.toString().toLowerCase().includes(filterValue));
  }

  public isArray(object): boolean {
    return Array.isArray(object);
  }

  public removeItem(item: LineItem): void {
  
    this.po.lineItems.splice(this.po.lineItems.indexOf(item), 1);
    this.calcTotal();
  }

  

  addItem2(item: LineItem) {
   
    let index = this.lineItems.findIndex(poLineItem => (item.model === poLineItem.model));
        
      if(index !== -1) {   
        this.lineItems[index].quantity += item.quantity;
        this.poLineItems.controls[index].patchValue({'quantity': this.lineItems[index].quantity}); 
      } else {
        this.lineItems.push(item);
        let row = new FormGroup({
          'model':    new FormControl(item.model),
          'quantity': new FormControl(item.quantity),
          'comments': new FormControl(item.comments)
        });
      
        this.poLineItems.push(row); 
        this.poForm.addControl('poLineItems', this.poLineItems);
      }
      this.calcTotal();
  }

  calcTotal() {
    this.subtotal = 0;
    this.po.lineItems.forEach( (poLineItem, index) => {
      
      var quantity = this.poForm.controls.poLineItems['controls'][index].value.quantity;
      var cost = this.po.lineItems[index].cost;
      this.subtotal += (quantity * cost);
      
    });
  }

  calcRowTotal(index: number) {

    this.po.lineItems[index].quantity = this.poForm.controls.poLineItems['controls'][index].value.quantity;
    this.po.lineItems[index].subtotal = this.po.lineItems[index].quantity * this.po.lineItems[index].cost;
    this.calcTotal();

  }


  saveThisPO() {
    this.po.id = this.poForm.value.id === '0' ? '' : this.poForm.value.id ;

    if(undefined !== this.poForm.value.date_created) {
      this.po.created_date = this.poForm.value.date_created;
    }  
   
    this.po.lineItems = this.po.lineItems;
    this.po.provider = this.poForm.value.provider;
    this.po.status = 'draft';
    this.po.currencyId = this.poForm.value.currencyId;

    if(null == this.poForm.value.comments) {
      this.po.comments = '';
    }

    if(null != this.poForm.value.sos_included && "" != this.poForm.value.sos_included) {
      this.po.comments = this.poForm.value.comments + '/ ' + this.poForm.value.sos_included;
      this.poForm.get('sos_included').setValue('');
    }
    
    this.po.project = this.poForm.value.project;
    this.po.creator = this.username;
    
    // get quantity and comments from the form and save into po
    this.po.lineItems.forEach( (poLineItem, index) => {
      
      this.po.lineItems[index].quantity = this.poForm.controls.poLineItems['controls'][index].value.quantity;
      this.po.lineItems[index].comments = this.poForm.controls.poLineItems['controls'][index].value.comments; 
    });

    this.po.subtotal = this.subtotal;
   
    // check inventory
    this.invService.checkInventory(this.po.lineItems).subscribe((result) => {

      if(result === "error") {
        if(confirm("Stock file is not available. Do you want to proceed?") ) {
          this.saveInDB([]);
        }
      } else if(result !== "no items") {
        this.removeReservedItemsFromThisPO(result['items']);
        this.saveInDB(result['items']);
      } else {
        this.saveInDB([]);
      }

    });
  }

  saveInDB(inventory_items_reserved) {
    
    const provId = this.searchProviderID(this.po.provider);
    const currId = this.searchCurrencyID(this.po.currencyId);
    this.po.provider = provId;
    this.po.currencyId = currId;
    this.po.payment_terms = this.searchProviderCDias(provId);
    
    if (inventory_items_reserved.length > 0 ) {
      inventory_items_reserved.forEach( item => {
        this.success_items_reserved = "[model =" + item.model + " qty = " + item.quantity + "] , ";
      });
      
    }

    this.store.dispatch(new POActions.SavePurchaseOrder(this.po));
    //this.store.dispatch(new SOActions.CheckSOStatus());
  }

  removeReservedItemsFromThisPO(items) {

    for(let i = 0; i < items.length; i++) {
      let itemReserved = items[i];
        
      let index = this.lineItems.findIndex(poLineItem => (itemReserved.model === poLineItem.model));

      if(index !== -1) {   
        if(this.lineItems[index].quantity === itemReserved.quantity) {      
          this.lineItems.splice(index, 1);
          this.poLineItems.controls.splice(index, 1);       
        } else {        
          this.lineItems[index].quantity = this.lineItems[index].quantity - itemReserved.quantity;
          this.poLineItems.controls[index].patchValue({'quantity': this.lineItems[index].quantity}); 
        } 
      }
    }    
  }

  closeAlert() {
    this.error = null;
    this.success = null;
    this.success_items_reserved = null;
  }

  searchProviderName(id: string) {
    
    if(undefined === id || "" === id || "0" === id) {
      return "";  
    } else {
      return this.providers.filter(option => (option.contpaqId == (id)))[0].name;
    }
  }

  searchProviderID(name: string) {
    
    if(undefined === name || "" === name) {
      return '0';  
    } else {
      return this.providers.filter(option => (option.name == name))[0].contpaqId;
    }
  }

  searchProviderCDias(id: string) {
    
    if(undefined === id || "" === id || "0" === id) {
      return "";  
    } else {
      return this.providers.filter(option => (option.contpaqId == (id)))[0].cdias;
    }
  }

  searchProviderTaxRate(name: string) {
    
    if(undefined === name || "" === name) {
      return 0;  
    } else {
      return this.providers.filter(option => (option.name == name))[0].tax_rate;
    }
  }

  searchCurrencyName(id: string) {
    
    if(undefined === id || "" === id || "0" === id) {
      return "";  
    } else {
      return this.currencies.filter(option => (option.id == id))[0].name;
    }
    
  }

  searchCurrencyID(name: string) {
   
    if(undefined === name || "" === name) {
      return '0';  
    } else {
      return this.currencies.filter(option => (option.name == name))[0].id;
    }
    
  }

  setTaxRate() {
    this.tax_rate = this.searchProviderTaxRate(this.po.provider);
  }

  contpaq(){
    this.store.dispatch(new POActions.SendToContpaq(this.po.id));
    this.po.status = 'sent';
  }

  exportCsv() {
    var data = [];

    this.po.lineItems.forEach( (poLineItem, index) => {
      data.push({model: poLineItem.model, quantity: poLineItem.quantity });
    });

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false, 
      showTitle: false,
      useBom: false,
      noDownload: false
    };
    
      new Angular5Csv(data, "PO "  + this.po.id , options);
  }

  deletePO() {
    if(confirm("Are you sure to delete?")) {
      this.store.dispatch(new POActions.DeletePO(this.po.id));
      this.store.dispatch(new POActions.SetPO(new PO('','','','0','',[], '0', '','draft','',this.username,0,'')));
    
      this.store.dispatch(new POActions.GetPODrafts());
    }
  }
  
}