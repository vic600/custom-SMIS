import { Injectable } from '@angular/core';
import { AuthadminService } from './authadmin.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class MealsService {
  options;
  domain = 'http://localhost:5000';
  constructor(
    private http: Http,
    private authadmin: AuthadminService
  ) { }
  createheaders() {
    this.authadmin.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authadmin.authtoken
      })
    })
  }

  getmenu() {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/menu', this.options).map(res => res.json());
  }
  addfood(menu) {
    this.createheaders();
    return this.http.post(this.domain + '/authadmin/addmeal', menu, this.options).map(res => res.json());
  }
  getmeal(id) {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/meal/' + id, this.options).map(res => res.json());
  }
  editfood(meal) {
    this.createheaders();
    return this.http.put(this.domain + '/authadmin/editmenu', meal, this.options).map(res => res.json());
  }
  deletefood(id) {
    this.createheaders();
    return this.http.delete(this.domain + '/authadmin/deletemeal/' + id, this.options).map(res => res.json());
  }
}
