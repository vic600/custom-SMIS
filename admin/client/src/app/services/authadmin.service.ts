import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthadminService {
  options;
  domain = 'http://localhost:5000';
  authtoken;
  admin;
  constructor(
    private http: Http
  ) { }

  createheaders() {
    this.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authtoken
      })
    })
  }

  loadtoken() {
    const token = localStorage.getItem('token');
    this.authtoken = token;
  }

  registeradmin(admin) {
    return this.http.post(this.domain + '/authadmin/register', admin).map(res => res.json());
  }

  login(admin) {
    return this.http.post(this.domain + '/authadmin/login', admin).map(res => res.json());
  }

  profile() {
    this.createheaders()
    return this.http.get(this.domain + '/authadmin/profile', this.options).map(res => res.json());
  }

  resetemail(email) {
    return this.http.put(this.domain + '/authadmin/resetpassword', email).map(res => res.json());
  }

  checktoken(token) {
    return this.http.get(this.domain + '/authadmin/resetpassword/' + token).map(res => res.json());
  }
  savepassword(pass) {
    return this.http.put(this.domain + '/authadmin/savepassword', pass).map(res => res.json());
  }

 
  logout() {
    this.authtoken = null;
    this.admin = null;
    localStorage.clear();
  }
  storeuserdata(admin, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    this.authtoken = token;
    this.admin = admin;
  }
  loggedIn() {
    return tokenNotExpired();
  }
}
