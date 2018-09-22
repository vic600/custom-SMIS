import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  domain = 'http://localhost:8080';
  authtoken;
  user;
  options;
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
    });
  }

  loadtoken() {
    const token = localStorage.getItem('token');
    this.authtoken = token;
  }
  registeruser(user) {
    return this.http.post(this.domain + '/auth/register', user).map(res => res.json());
  }

  login(user) {
    return this.http.post(this.domain + '/auth/login', user).map(res => res.json());
  }

  getinfo() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/allinfo', this.options).map(res => res.json());
  }

  logout() {
    this.authtoken = null;
    this.user = null;
    localStorage.clear();
  }
  storeuserdata(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authtoken = token;
    this.user = user;
  }
  loggedIn() {
    return tokenNotExpired();
  }
  getprofile() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/profile', this.options).map(res => res.json());
  }
}
