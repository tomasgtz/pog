import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   authState: Observable<any>;
   message: string;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.authState = this.store.select('auth');
        
    this.authState.subscribe((authState: fromAuth.AuthState) => {
      this.message = authState.successMessage.header;
      
    })
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  missingProducts() {
    this.store.dispatch(new AuthActions.CheckMissingItems())
  }

  dismiss() {
    this.message = null;
  }
}
