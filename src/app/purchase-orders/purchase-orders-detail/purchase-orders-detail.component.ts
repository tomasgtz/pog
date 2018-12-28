import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { PO } from '../../shared/po.model';
import { LineItem } from '../../shared/line-item.model';
import { Provider } from '../../shared/provider.model';
import { Observable, of } from 'node_modules/rxjs';
import * as fromApp from '../../store/app.reducers';
import * as fromPO from '../store/po.reducers';
import * as POActions from '../store/po.actions';

import * as fromSO from '../../sales-orders/store/so.reducers';

import * as fromAuth from '../../auth/store/auth.reducers';
import { Store } from '@ngrx/store';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { map, startWith } from '../../../../node_modules/rxjs/operators';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { CheckInventoryService } from '../../shared/check-inventory.service';

@Component({
  encapsulation: ViewEncapsulation.None,
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
  soState: Observable<fromSO.State>;
  authState: Observable<fromAuth.AuthState>;
  poForm: FormGroup;
  providerCtrl = new FormControl();
  providers: Provider[];
  providersO: Observable<Provider[]>;
  currencies = [{id:'1', name:'MXN'},{id:'2', name:'USD'},{id:'3', name:'EUR'}];
  error;
  success: string;
  poLineItems: FormArray = new FormArray([]);
  //providers2: Provider[];
  username: string = '';
  items_to_transfer:LineItem[] = [];

  constructor(private store: Store<fromApp.AppState>,   private invService: CheckInventoryService) { }

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
    this.soState.subscribe((soState: fromSO.State) => {
      this.items_to_transfer = soState.items_to_transfer;

      of(this.items_to_transfer).subscribe( (items) => {

        if(null != items) {
          
          items.forEach((item: LineItem) => {
            this.addItem2(item);
          });
        }
  
      });

    });

    this.po = new PO('','','',0,'',this.lineItems, '0', '','draft','',this.username);
    this.poState = this.store.select('po');
    this.poState.subscribe((poState: fromPO.State) => {
     
      this.providers = poState.providers;
      this.providersO = this.poForm.get('provider').valueChanges.pipe(startWith(''), map(value => this._filter(value)));
      this.poForm.get('id').setValue(poState.po.id + "");
      this.poForm.get('date_created').setValue(poState.po.created_date.substring(0,10));
      
      this.poForm.get('provider').setValue(this.searchProviderName(poState.po.provider));
      this.poForm.get('currencyId').setValue(this.searchCurrencyName(poState.po.currencyId ));
      
      this.poForm.get('buyer').setValue(poState.po.creator);
      this.poForm.get('comments').setValue(poState.po.comments);
      this.poForm.get('sos_included').setValue(poState.po.project);
      this.po = poState.po;
      this.lineItems = poState.po.lineItems;
      this.error = poState.error;
      this.success = poState.success;
      
      of(this.lineItems).subscribe( (items) => {
        
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
          
          this.poForm.removeControl('poLineItems');     
          this.poForm.addControl('poLineItems', this.poLineItems);
      
          
        }
      
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

  }

  public addItem(): void {
    
    const item = this.po.lineItems[this.po.lineItems.length-1];

    let row = new FormGroup({
      'model':    new FormControl(item.model),
      'quantity': new FormControl(item.quantity),
      'comments': new FormControl(item.comments)
    });
  
    this.poLineItems.push(row); 
    this.poForm.addControl('poLineItems', this.poLineItems);

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

    
  }

  
  onSubmit() {

  }

  saveThisPO() {
    this.po.id = this.poForm.value.id === '0' ? '' : this.poForm.value.id ;
    this.po.created_date = this.poForm.value.date_created;
    this.po.lineItems = this.po.lineItems;
    this.po.provider = this.poForm.value.provider;
    this.po.status = 'draft';
    this.po.currencyId = this.poForm.value.currencyId;
    this.po.comments = this.poForm.value.comments;
    this.po.project = this.poForm.value.project;
    this.po.creator = this.username;
    
    // get quantity and comments from the form and save into po
    this.po.lineItems.forEach( (poLineItem, index) => {
      
      this.po.lineItems[index].quantity = this.poForm.controls.poLineItems['controls'][index].value.quantity;
      this.po.lineItems[index].comments = this.poForm.controls.poLineItems['controls'][index].value.comments; 
    });
   
    // check inventory
    this.invService.checkInventory(this.po.lineItems).subscribe((result) => {

      if(result === "error") {
        if(confirm("Stock file is not available. Do you want to proceed?") ) {
          this.saveInDB();
        }
      } else if(result !== "no items"){
        this.removeReservedItemsFromThisPO(result['items']);
        this.saveInDB();
      } else {
        this.saveInDB();
      }

    });
  }

  saveInDB() {
    console.log(this.po);
    const provId = this.searchProviderID(this.po.provider);
    const currId = this.searchCurrencyID(this.po.currencyId);
    this.po.provider = provId;
    this.po.currencyId = currId;

    this.store.dispatch(new POActions.SavePurchaseOrder(this.po));
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
  }

  searchProviderName(id: string) {
    
    
    if(undefined === id || "" === id) {
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

  searchCurrencyName(id: string) {
   
    if(undefined === id || "0" === id) {
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
  
}
