import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
    redirecturl;
    constructor(
        private authservice: AuthService,
        private router: Router
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.authservice.loggedIn()) {
            return true;
        } else {
            this.redirecturl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }
}