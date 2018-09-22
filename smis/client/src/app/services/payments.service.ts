import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
@Injectable()
export class PaymentsService {
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
  getmeals() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/menu', this.options).map(res => res.json());
  }
  payment(pay) {
    this.createheaders();
    return this.http.post(this.domain + '/auth/payment', pay, this.options).map(res => res.json());

  }
  getpayment(id) {
    this.createheaders();
    return this.http.get(this.domain + '/auth/paymentreceipt/' + id, this.options).map(res => res.json());
  }
  getbalance(id) {
    this.createheaders();
    return this.http.get(this.domain + '/auth/balance/' + id, this.options).map(res => res.json());
  }
  repayment(repay) {
    this.createheaders();
    return this.http.put(this.domain + '/auth/paybalance', repay, this.options).map(res => res.json());
  }
  getinfo() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/allinfo', this.options).map(res => res.json());
  }

  getpayments() {
    this.createheaders();
    return this.http.get(this.domain + '/auth/payments', this.options).map(res => res.json());
  }

}
