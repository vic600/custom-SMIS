import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-deleteuser',
  templateUrl: './deleteuser.component.html',
  styleUrls: ['./deleteuser.component.css']
})
export class DeleteuserComponent implements OnInit {
  currenturl;
  hide = true;
  user = {
    _id: String,
    email: String,
    username: String
  };
  constructor(
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private userservice: UserService,
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
    this.userservice.deleteu(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 6000);
      }
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.userservice.getuser(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.user = data.user;
        this.hide = false;
      }
    });
  }

}
