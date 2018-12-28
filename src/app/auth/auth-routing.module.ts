import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { SigninComponent } from "./signin/signin.component";
import { AuthGuard } from "./auth-guard.service";
import { SignupComponent } from "./signup/signup.component";

const authRoutes: Routes = [
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}