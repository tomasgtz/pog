import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../store/auth.reducers';
import * as AuthActions from '../store/auth.actions';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  success: string;
  loginForm: FormGroup;
  authState: Observable<fromAuth.AuthState>;

  constructor(private fb: FormBuilder, private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email]) ]
    });

    this.authState = this.store.select('auth');
    this.authState.subscribe((authState: fromAuth.AuthState) => {

      this.success = authState.successMessage;
    });

  }

  signUp() {

    const email = this.loginForm.get('email').value;
    this.store.dispatch(new AuthActions.TrySignup({username: email}));
  }

  signIn() {

    this.router.navigateByUrl("/signin");
  }


  closeAlert() {
    this.success = null;
  }
}
