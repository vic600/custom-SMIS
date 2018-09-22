import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthadminService } from '../services/authadmin.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(private authadmin: AuthadminService, private router: Router) { }

    canActivate() {
        if (this.authadmin.loggedIn()) {
            this.router.navigate(['/']);
            return false;
        } else {

            return true;
        }
    }
}