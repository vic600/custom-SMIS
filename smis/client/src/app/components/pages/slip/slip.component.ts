import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-slip',
  templateUrl: './slip.component.html',
  styleUrls: ['./slip.component.css']
})
export class SlipComponent implements OnInit {
  info = {
    tittle: String,
    motto: String,
    address: String,
    phone: Number,
    email: String
  }
  sale = {
    _id: String,
    product: String,
    price: Number,
    total: Number,
    change: Number,
    quantity: Number,
    date: Date,
    servedby: String
  };
  currenturl;
  loading = false;
  hide = true;
  constructor(
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private activatedroute: ActivatedRoute,
    private orderservice: OrderService,
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
    this.orderservice.getorder(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.hide = false;
        this.sale = data.order;

      }
    });
    this.authservice.getinfo().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });

      } else {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.info = data.info;
      }
    });

  }

}
