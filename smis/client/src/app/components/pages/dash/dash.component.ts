import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PaymentsService } from '../../../services/payments.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  hide = true;
  payments = [{
    _id: String,
    student: String,
    food: String,
    amount: String,
    balance: String,
    servedby: String,
    date: Date
  }]
  info = {
    tittle: String,
    motto: String,
    address: String,
    phone: Number,
    email: String
  }
  constructor(
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private paymentservice: PaymentsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
  ) {
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.paymentservice.getpayments().subscribe(res => {
      if (!res.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: res.message });
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: res.message });
        this.payments = res.payment;
        this.hide = false;
      }
    });
    this.authservice.getinfo().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.info = data.info;
        this.hide = false;
        this.spinner.hide();
      }
    });

  }

}
