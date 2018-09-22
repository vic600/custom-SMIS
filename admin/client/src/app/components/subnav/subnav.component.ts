import { Component, OnInit } from '@angular/core';
import { AuthadminService } from '../../services/authadmin.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.component.html',
  styleUrls: ['./subnav.component.css']
})
export class SubnavComponent implements OnInit {
  manager = {
    email: String,
    username: String
  }
  hide = true;
  constructor(
    private authadmin: AuthadminService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
  ) {
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
   }

  ngOnInit() {
   
    this.authadmin.profile().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
       
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
      
        this.manager = data.profile;
        this.hide = false;
        
      }
    });
  }

}
