import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthadminService } from '../../services/authadmin.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(
    private authadmin: AuthadminService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }
  logout() {
    this.spinner.show();
    this.authadmin.logout();
    this.msgService.message({ level: NgxMsgLevel.Info, text: 'Bye' });
    this.spinner.hide();
    this.router.navigate(['/login']);
  }
  ngOnInit() {

  }

}
