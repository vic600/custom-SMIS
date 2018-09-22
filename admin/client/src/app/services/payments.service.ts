import { Injectable } from '@angular/core';
import { AuthadminService } from './authadmin.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class PaymentsService {
  domain = "http://localhost:5000";
  options;
  constructor(
    private authadmin: AuthadminService,
    private http: Http
  ) { }
  createheaders() {
    this.authadmin.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authadmin.authtoken
      })
    });
  }

  getpayments() {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/payments', this.options).map(res => res.json());
  }
}
