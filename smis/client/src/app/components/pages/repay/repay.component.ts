import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../../services/payments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.css']
})
export class RepayComponent implements OnInit {
  form: FormGroup;
  currenturl;
  loading = false;
  processing = false;
  messageclass
  paid;
  bala;
  constructor(
    private spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    private paymentservice: PaymentsService,
    private activatedroute: ActivatedRoute,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService
  ) {
    this.createform();
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formbuilder.group({
      amount: ['', Validators.compose([
        Validators.required,
        this.validateamount
      ])]
    });
  }
  validateamount(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateamount': true }
    }
  }

  disableform() {
    this.form.controls['amount'].disable();
  }

  enableform() {
    this.form.controls['amount'].enable();
  }

  onrepayment() {
    this.processing = true;
    this.spinner.show();
    this.disableform();
    const repay = {
      _id: this.bala._id,
      amount: this.form.get('amount').value
    }

    this.paymentservice.repayment(repay).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.messageclass = 'callout callout-success';
        this.paid = data.pid;
      }
    });
  }
  ngOnInit() {
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.paymentservice.getbalance(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.bala = data.balance;
      }
    });
  }

}
