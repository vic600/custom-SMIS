import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentsService } from '../../../services/payments.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  info = {
    tittle: String,
    motto: String,
    address: String,
    phone: Number,
    email: String
  }
  currenturl;
  loading = false;
  hide = true;
  receipt = {
    _id: String,
    student: String,
    food: String,
    price: Number,
    amount: Number,
    balance: Number,
    servedby: String,
    date: Date
  }
  constructor(
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private activatedroute: ActivatedRoute,
    private paymentservice: PaymentsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
  ) {
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  print() {
    (<any>window).print();
  }

  ngOnInit() {
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.paymentservice.getpayment(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.hide = false;
        this.receipt = data.transaction;
      }
    });
    this.authservice.getinfo().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.info = data.info;
      }
    });
  }

}
