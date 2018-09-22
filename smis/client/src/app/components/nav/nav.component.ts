import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  hide = true;
  user = {
    email: String
  };
  constructor(
    private authservice: AuthService,
    private router: Router,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService
  ) {
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  onlogout() {
    this.authservice.logout();
    this.msgService.message({ level: NgxMsgLevel.Info, text: 'Bye' });
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    this.authservice.getprofile().subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: 'Failed to load user' });
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: 'User loaded' });
        this.hide = false;
        this.user = data.profile;
      }
    });
  }

}
