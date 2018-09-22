import { Component, OnInit } from '@angular/core';
import { AuthadminService } from '../../../services/authadmin.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthGuard } from '../../../guards/authadmin.guard';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
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
    private formbuilder: FormBuilder,
    private router: Router,
    private authadmin: AuthadminService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private authguard: AuthGuard
  ) {
    this.createform();
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formbuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(4),
        this.validemail
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(8),
        this.validatepassword
      ])]
    });
  }

  validemail(controls) {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validemail': true };
    }
  }

  validatepassword(controls) {
    const regExp = new RegExp(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatepassword': true }
    }
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
    this.processing = true;
    this.spinner.show();
    this.disableform();
    const admin = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }

    this.authadmin.login(admin).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.processing = false;
        this.spinner.hide();
        this.authadmin.storeuserdata(data.admin, data.token);
        setTimeout(() => {
          if (this.previousurl) {
            this.router.navigate([this.previousurl]);
          } else {
            this.router.navigate(['/dash']);
          }

        }, 6000);
      }
    });
  }
  ngOnInit() {
    if (this.authguard.redirecturl) {
      this.msgService.message({ level: NgxMsgLevel.Error, text: 'Login First' });
      this.previousurl = this.authguard.redirecturl;
      this.authguard.redirecturl = undefined;
    }
  }

}
