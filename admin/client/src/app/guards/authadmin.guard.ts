import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthadminService } from '../services/authadmin.service';

@Injectable()
export class AuthGuard implements CanActivate {
    redirecturl;
    constructor(private authadmin: AuthadminService, private router: Router) { }

    canActivate(
        router: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.authadmin.loggedIn()) {
           
            return true;
        } else {
            this.redirecturl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }
}