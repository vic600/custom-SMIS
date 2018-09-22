import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthadminService } from './authadmin.service';
import 'rxjs/add/operator/map';
@Injectable()
export class InfoService {
  domain = 'http://localhost:5000';
  options;
  constructor(
    private http: Http,
    private adminservice: AuthadminService
  ) { }
  createheaders() {
    this.adminservice.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.adminservice.authtoken
      })
    })
  }

  getinfo() {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/allinfo', this.options).map(res => res.json());
  }

  addinfo(info) {
    this.createheaders();
    return this.http.post(this.domain + '/authadmin/addinfo', info, this.options).map(res => res.json());
  }
  info(id) {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/info/' + id, this.options).map(res => res.json());
  }
  editinfo(info) {
    this.createheaders();
    return this.http.put(this.domain + '/authadmin/editinfo', info, this.options).map(res => res.json());
  }
  deleteinfo(id) {
    this.createheaders();
    return this.http.delete(this.domain + '/authadmin/deleteinfo/' + id, this.options).map(res => res.json());
  }
}
