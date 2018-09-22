import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UniformsService } from '../../../../services/uniforms.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-adduniforms',
  templateUrl: './adduniforms.component.html',
  styleUrls: ['./adduniforms.component.css']
})
export class AdduniformsComponent implements OnInit {
  form: FormGroup;
  processing = false;
  constructor(
    private formbuilder: FormBuilder,
    private uniformservice: UniformsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.createform();
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formbuilder.group({
      product: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(4),
        this.validproduct
      ])],
      price: ['', Validators.compose([
        Validators.required,
        this.validprice
      ])],
      stock: ['', Validators.compose([
        Validators.required,
        this.validstock
      ])]
    });
  }

  validproduct(controls) {
    const regExp = new RegExp(
      /^[a-zA-Z]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validproduct': true }
    }
  }

  validprice(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validprice': true }
    }
  }

  validstock(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validstock': true }
    }
  }

  disableform() {
    this.form.controls['product'].disable();
    this.form.controls['price'].disable();
    this.form.controls['stock'].disable();
  }

  enableform() {
    this.form.controls['product'].enable();
    this.form.controls['price'].enable();
    this.form.controls['stock'].enable();
  }

  onadd() {
    this.spinner.show();
    this.disableform();
    this.processing = true;
    const uniform = {
      product: this.form.get('product').value,
      price: this.form.get('price').value,
      stock: this.form.get('stock').value
    }
    this.uniformservice.adduni(uniform).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide()
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/uniforms']);
        }, 6000);
      }
    });
  }
  ngOnInit() {
  }

}
