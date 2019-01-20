import { Component, OnInit } from '@angular/core';

import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../store/auth.reducers';
import * as AuthActions from '../store/auth.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  error: string;
  authState: Observable<fromAuth.AuthState>;

  constructor( private socialAuthService: AuthService, private store: Store<fromApp.AppState>, private router: Router ) { }

  ngOnInit() {

    this.authState = this.store.select('auth');
    this.authState.subscribe((authState: fromAuth.AuthState) => {

      this.error = authState.error;
    });

  }
  
  public socialSignIn() {
    let socialPlatformProvider;

    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
	
	  this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        
    const idToken = userData.idToken;
	
		this.store.dispatch(new AuthActions.TrySignin({
      username: userData.email, 
      token: userData.token, 
      name: userData.name, 
      image: userData.image}));
            
      }
    );
  }

  signUp() {
    this.router.navigateByUrl("/signup");
  }

  closeAlert() {
    this.error = null;
  }

}