import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthadminService } from '../services/authadmin.service';
import 'rxjs/add/operator/map';
@Injectable()
export class UserService {
  domain = 'http://localhost:5000';
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
    })
  }
  adduser(user) {
    this.createheaders();
    return this.http.post(this.domain + '/authadmin/adduser', user, this.options).map(res => res.json());
  }
  getusers() {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/allusers', this.options).map(res => res.json());
  }
  getuser(id) {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/user/' + id, this.options).map(res => res.json());
  }
  deleteu(id) {
    this.createheaders();
    return this.http.delete(this.domain + '/authadmin/deleteuser/' + id, this.options).map(res => res.json());
  }
}
