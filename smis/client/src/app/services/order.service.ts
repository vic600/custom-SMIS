import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, ResponseOptions, Headers, RequestOptions } from '@angular/http';
@Injectable()
export class OrderService {
  domain = 'http://localhost:8080';
  options;
  constructor(
    private authservice: AuthService,
    private http: Http
  ) { }
  createheaders() {
    this.authservice.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authservice.authtoken
      })
    })
  }

  getkits() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/alluniforms', this.options).map(res => res.json());
  };

  makeorder(order) {
    this.createheaders();
    return this.http.put(this.domain + '/auth/makesale', order, this.options).map(res => res.json());
  }
  getorder(id) {
    this.createheaders();
    return this.http.get(this.domain + '/auth/order/' + id, this.options).map(res => res.json());
  }
  getinfo() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/allinfo', this.options).map(res => res.json());
  }

}
