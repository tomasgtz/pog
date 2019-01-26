import { NgModule } from '@angular/core';

import { AuthRoutingModule } from "./auth-routing.module";
import { SigninComponent } from "./signin/signin.component";
import { UsersComponent } from "./users/users.component";
import { HttpClientModule } from '@angular/common/http';

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
} from "angular5-social-login";
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from './auth-guard.service';
import { SignupComponent } from './signup/signup.component';
import { USERAllowedPipe, USERNotAllowedPipe } from '../shared/user.pipe';

import {  ReactiveFormsModule } from '@angular/forms';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("1078384584362-emdogegr1lrc3puccn7rqul57shj2kmc.apps.googleusercontent.com")
        }
      ]
  );
  return config;
}

@NgModule({
  imports: [
    AuthRoutingModule,
	  SocialLoginModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    
    SigninComponent,
    UsersComponent,
    SignupComponent,
    USERAllowedPipe, 
    USERNotAllowedPipe
  ],
  providers: [
    AuthGuard, 
  {
	  provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }
  ]
})
export class AuthModule { }


