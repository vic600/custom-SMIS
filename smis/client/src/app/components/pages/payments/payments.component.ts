import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PaymentsService } from '../../../services/payments.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  form: FormGroup;
  loading = false;
  meals;
  processing = false;
  paid;
  messageclass;
  message;
  balance;
  bal;
  constructor(
    private spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    private paymentservice: PaymentsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
  ) {
    this.createform();
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }
  createform() {
    this.form = this.formbuilder.group({
      student: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(4),
        this.validstudent
      ])],
      food: ['', Validators.required],
      amount: ['', Validators.compose([
        Validators.required,
        this.validamount
      ])]
    });
  }

  validstudent(controls) {
    const regExp = new RegExp(
      /^[a-zA-Z]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validstudent': true };
    }
  }

  validamount(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validamount': true };
    }
  }

  disableform() {
    this.form.controls['student'].disable();
    this.form.controls['food'].disable();
    this.form.controls['amount'].disable();
  }

  enableform() {
    this.form.controls['student'].enable();
    this.form.controls['food'].enable();
    this.form.controls['amount'].enable();
  }

  onpayment() {
    this.spinner.show();
    this.processing = true;
    this.disableform();
    const pay = {
      student: this.form.get('student').value,
      food: this.form.get('food').value,
      amount: this.form.get('amount').value
    }
    this.paymentservice.payment(pay).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.messageclass = 'callout callout-danger';
        this.message = data.message;
        this.bal = data.balance;
        this.balance = data.bid;
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.messageclass = 'callout callout-success';
        this.message = data.message;
        this.paid = data.payment;
      }
    });
  }
  ngOnInit() {
    this.spinner.show();
    this.paymentservice.getmeals().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: 'Menu loaded' });
        this.spinner.hide();
        this.meals = data.menu;
      }
    });
  }

}
