import { NgModule } from '@angular/core';

import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";
import { SigninComponent } from "./signin/signin.component";
import { UsersComponent } from "./users/users.component";
import { HttpClientModule } from '@angular/common/http';
import { DropdownDirective } from '../shared/dropdown.directive';

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
} from "angular5-social-login";
import { SharedModule } from '../shared/shared.module';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("1078384584362-pslq17jtp1lrcsqhv52horu7tjt9bdqc.apps.googleusercontent.com")
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
    SharedModule
  ],
  declarations: [
    AuthComponent,
    SigninComponent,
    UsersComponent
  ],
  providers: [ 
  {
	provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }
  ]
})
export class AuthModule { }


