import { Component, OnInit } from '@angular/core';

import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor( private socialAuthService: AuthService, private store: Store<fromApp.AppState> ) { }

  ngOnInit() {
  }
  
  
  public socialSignIn() {
    let socialPlatformProvider;

    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
	
	this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log("Sign in data : " , userData);
        
    const idToken = userData.idToken;
		
	
		this.store.dispatch(new AuthActions.TrySignin({
      username: userData.email, 
      token: userData.token, 
      name: userData.name, 
      image: userData.image}));
            
      }
    );
  }

}
