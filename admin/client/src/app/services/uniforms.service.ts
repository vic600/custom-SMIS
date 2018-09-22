import { Injectable } from '@angular/core';
import { AuthadminService } from '../services/authadmin.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class UniformsService {
  domain = 'http://localhost:5000';
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

  getuni() {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/alluniforms', this.options).map(res => res.json());
  }

  adduni(uniform) {
    this.createheaders();
    return this.http.post(this.domain + '/authadmin/adduniform', uniform, this.options).map(res => res.json());
  }

  getuniform(id) {
    this.createheaders();
    return this.http.get(this.domain + '/authadmin/uniform/' + id, this.options).map(res => res.json());
  }

  edituniform(uniform) {
    this.createheaders();
    return this.http.put(this.domain + '/authadmin/edituniform', uniform, this.options).map(res => res.json());
  }

  deleteuniform(id) {
    this.createheaders();
    return this.http.delete(this.domain + '/authadmin/deleteuni/' + id, this.options).map(res => res.json());
  }
}
