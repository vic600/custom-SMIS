import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../../services/payments.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments = {
    _id: String,
    student: String,
    food: String,
    price: Number,
    amount: Number,
    balance: Number,
    servedby: String,
    date: Date
  };
  hide = true;
  constructor(
    private paymentservice: PaymentsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
  ) {
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.paymentservice.getpayments().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.payments = data.payment;
        this.hide = false;
      }
    });
  }

}
