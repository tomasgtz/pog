import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../store/auth.reducers';
import * as AuthActions from '../store/auth.actions';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  success: string;
  
  users: any[];
  users2: any[];
  authState: Observable<fromAuth.AuthState>;

  constructor( private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.dispatch(new AuthActions.GetUsers());
    this.authState = this.store.select('auth');
    this.authState.subscribe((authState: fromAuth.AuthState) => {

      this.success = authState.successMessage.users;
      this.users = authState.users;
     
    });
  }

  toggle(user) {
    
    user.allowed = (user.allowed == "1" ? "0": "1");
    const id = this.users.findIndex(olduser => (user.id === olduser.id));
    this.users[id].allowed = user.allowed
      
  }

  save() {
    this.store.dispatch(new AuthActions.SaveUsers({users: this.users}));
  }

  closeAlert() {
    this.success = null;
  }

}
