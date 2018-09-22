import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.component.html',
  styleUrls: ['./subnav.component.css']
})
export class SubnavComponent implements OnInit {
  hide = true;
  user = {
    email: String,
    username: String
  };
  constructor(
    private authservice: AuthService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
  ) {
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  ngOnInit() {
    this.authservice.getprofile().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.user = data.profile;
        this.hide = false;
      }
    });
  }

}
