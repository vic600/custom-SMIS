import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../../services/info.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-deleteinfo',
  templateUrl: './deleteinfo.component.html',
  styleUrls: ['./deleteinfo.component.css']
})
export class DeleteinfoComponent implements OnInit {
  currenturl;
  info = {
    _id: String,
    title: String,
    motto: String,
    address: String,
    phone: Number,
    email: String
  };
  hide = true;
  constructor(
    private infoservice: InfoService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private location: Location
  ) {
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  goback() {
    this.location.back();
  }
  ondelete() {
    this.spinner.show();
    this.infoservice.deleteinfo(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide()
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/info']);
        }, 6000);
      }
    });
  }
  ngOnInit() {
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.infoservice.info(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.info = data.school;
        this.hide = false;
      }
    });
  }

}
