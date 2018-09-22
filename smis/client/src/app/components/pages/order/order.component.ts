import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  loading = false;
  kits;
  processing = false;
  messageclass;
  message;
  sale;
  constructor(
    private spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    private orderservice: OrderService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
  ) {
    this.createform();
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }
  createform() {
    this.form = this.formbuilder.group({
      product: ['', Validators.required],
      quantity: ['', Validators.compose([
        Validators.required,
        this.vaidq
      ])],
      paid: ['', Validators.compose([
        Validators.required,
        this.validpaid
      ])]
    });
  }
  vaidq(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validq': true }
    }
  }
  validpaid(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validpaid': true };
    }
  }
  disableform() {
    this.form.controls['product'].disable();
    this.form.controls['quantity'].disable();
    this.form.controls['paid'].disable();
  }

  enableform() {
    this.form.controls['product'].enable();
    this.form.controls['quantity'].enable();
    this.form.controls['paid'].enable();
  }

  onorder() {
    this.spinner.show();
    this.disableform();
    this.processing = true;
    const order = {
      product: this.form.get('product').value,
      quantity: this.form.get('quantity').value,
      paid: this.form.get('paid').value
    };
    this.orderservice.makeorder(order).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.enableform();
        this.processing = false;

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: 'Order made successfully' });
        this.spinner.hide();
        this.processing = false;
        this.messageclass = 'callout callout-success';
        this.message = data.message;
        this.sale = data.sale;
      }
    })
  }
  ngOnInit() {
    this.spinner.show();
    this.orderservice.getkits().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: 'kits loaded' });
        this.spinner.hide();
        this.kits = data.uniforms;
      }
    });
  }

}
