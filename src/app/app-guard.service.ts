import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from './store/app.reducers';
import { Injectable } from "@angular/core";
import { map } from "node_modules/rxjs/operators";
import { getUserState } from "./auth/store/auth.reducers";
import { Observable, of } from "node_modules/rxjs";


@Injectable()
export class AppGuard implements CanActivate {
    authenticatedO: Observable<boolean>;


    constructor(private store: Store<fromApp.AppState>, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let store = this.store.select('auth');

        return store.pipe(map((state) => {
         
            if(state) {

                if(!state.authenticated) {
                    this.router.navigate(['/auth/signin']);
                }
                return state.authenticated;
            }

            return false;
             
             
        }));

    }
}