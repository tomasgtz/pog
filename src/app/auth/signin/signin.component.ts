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
        //console.log("Sign in data : " , userData);
        
        const email = userData.email;
		const idToken = userData.idToken;
		const token = userData.token;
	
		this.store.dispatch(new AuthActions.TrySignin({username: email, token: token}));
            
      }
    );
  }

}
