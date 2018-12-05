import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as SOActions from '../store/so.actions';


@Component({
  selector: 'app-sales-orders-filter',
  templateUrl: './sales-orders-filter.component.html',
  styleUrls: ['./sales-orders-filter.component.css']
})
export class SalesOrdersFilterComponent implements OnInit {

  filterForm: FormGroup;
  checks: boolean[] = [];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.filterForm = new FormGroup({
      'chkCMH': new FormControl(false),
      'chkCTRL': new FormControl(false),
      'chkEOL': new FormControl(false),
      'chkSS': new FormControl(false),
    });

    this.filterForm.valueChanges.subscribe(
      (value) => {
        this.checks = value;
        console.log(this.checks);
        this.updateChecks();
      }
    );
  }

  updateChecks() {
    this.store.dispatch(new SOActions.UpdateSearchFilters(this.checks));
  }

}
