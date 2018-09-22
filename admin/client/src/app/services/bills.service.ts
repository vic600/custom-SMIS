import { Injectable } from '@angular/core';
import { AuthadminService } from './authadmin.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class BillsService {
  domain = "http://localhost:5000";
  options;
  constructor(
    private http: Http,
    private authadmin: AuthadminService
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

  getbills() {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/sales', this.options).map(res => res.json());
  }
}
