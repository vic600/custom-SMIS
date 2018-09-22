import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { AuthService } from '../../../services/auth.service';
import { AuthGuard } from '../../../guards/auth.guard';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  processing = false;
 
  previousurl;
  constructor(
    private spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    private authservice: AuthService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private router: Router,
    private authguard: AuthGuard
  ) {
    this.createform();
    configService.position = NgxMsgPosition.TopRight;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  disableform() {
    this.form.controls['email'].disable();
    this.form.controls['password'].disable();
  }
  enableform() {
    this.form.controls['email'].enable();
    this.form.controls['password'].enable();
  }

  onlogin() {
    this.spinner.show();
    this.processing = true;
    this.disableform();
    const user = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
    this.authservice.login(user).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.authservice.storeuserdata(data.token, data.user);
        this.spinner.hide();
        setTimeout(() => {
          if (this.previousurl) {
            this.router.navigate([this.previousurl]);
          } else {
            this.router.navigate(['/dash']);
          }

        }, 3000);
      }
    });
  }
  ngOnInit() {
    if (this.authguard.redirecturl) {
      this.msgService.message({ level: NgxMsgLevel.Error, text: 'You must be logged in' });
      this.previousurl = this.authguard.redirecturl;
      this.authguard.redirecturl = undefined;
    }
  }

}
