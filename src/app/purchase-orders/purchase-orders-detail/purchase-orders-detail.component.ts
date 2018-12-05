import { Component, OnInit, Input } from '@angular/core';
import { PO } from '../../shared/po.model';
import { LineItem } from '../../shared/line-item.model';
import { Provider } from '../../shared/provider.model';
import { Observable, of } from 'node_modules/rxjs';
import * as fromApp from '../../store/app.reducers';
import * as fromPO from '../store/po.reducers';
import * as POActions from '../store/po.actions';

import * as fromAuth from '../../auth/store/auth.reducers';
import { Store } from '@ngrx/store';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { map, startWith } from '../../../../node_modules/rxjs/operators';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

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
  authState: Observable<fromAuth.AuthState>;
  poForm: FormGroup;
  providerCtrl = new FormControl();
  providers: Provider[];
  providersO: Observable<Provider[]>;
  currencies = [{id:1, name:'MXN'},{id:2, name:'USD'},{id:3, name:'EUR'}];
  error;
  success: string;
  poLineItems: FormArray = new FormArray([]);
  //providers2: Provider[];
  username: string = '';

  constructor(private store: Store<fromApp.AppState>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/thumb_up_24px.svg'));
    iconRegistry.addSvgIcon(
      'thumbs-down',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/thumb_down_24px.svg'));
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

    this.po = new PO('','','',0,'',this.lineItems, 0, '','draft','',this.username);
    this.poState = this.store.select('po');
    this.poState.subscribe((poState: fromPO.State) => {
     
      this.providers = poState.providers;
      this.providersO = this.poForm.get('provider').valueChanges.pipe(startWith(''), map(value => this._filter(value)));
      this.poForm.get('id').setValue(poState.po.id + "");
      this.poForm.get('date_created').setValue(poState.po.created_date.substring(0,10));
      this.poForm.get('provider').setValue(poState.po.provider);
      this.poForm.get('currencyId').setValue(poState.po.currencyId + "");
      this.poForm.get('buyer').setValue(poState.po.creator);
      this.poForm.get('comments').setValue(poState.po.comments);
      this.poForm.get('sos_included').setValue(poState.po.project);
      this.po = poState.po;
      this.lineItems = poState.po.lineItems;
      this.error = poState.error;
      this.success = poState.success;
      
      of(this.lineItems).subscribe( (items) => {
        if(null != items) {
          items.forEach((item: LineItem) => {
          
            let row = new FormGroup({
              'quantity': new FormControl(item.quantity),
              'comments': new FormControl(item.comments)
            });
          
            this.poLineItems.push(row);  
          });
          
          this.poForm.addControl('poLineItems', this.poLineItems);
      
          console.log(this.poForm.controls);
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

  public addItem(item: LineItem): void {
    this.po.lineItems.push(item);

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
    console.log(this.poForm.value.poLineItems);
    console.log(this.po.lineItems);

    //this.store.dispatch(new POActions.SavePurchaseOrder(this.po));
  }

  closeAlert() {
    this.error = null;
    this.success = null;
  }
}


