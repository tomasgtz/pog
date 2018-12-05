import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducers';
import { Injectable } from "@angular/core";
import { map } from "../../../node_modules/rxjs/operators";
import { getUserState } from "./store/auth.reducers";
import { Observable, of } from "../../../node_modules/rxjs";


@Injectable()
export class AuthGuard implements CanActivate {
    authenticatedO: Observable<boolean>;


    constructor(private store: Store<fromApp.AppState>) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let store = this.store.select('auth');

        return store.pipe(map((state) => {

            console.log("asd");
            console.log(state);
            if(state) {
                return state.authenticated;
            }
            return false;
             
             
        }));

    }
}