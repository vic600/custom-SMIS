import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationBarService, NotificationType } from 'ngx-notification-bar/release';
import {INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService} from 'ngx-msg';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  processing = false;
  messageclass;
  message;
  loading = false;
  constructor(
    private formbuilder: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private notificationBarService: NotificationBarService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService
  ) {
    this.createform();
    configService.position = NgxMsgPosition.TopRight;
        configService.visibleTime = 5000;
        configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formbuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(8),
        this.validatemail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(4),
        this.validateusername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(8),
        this.validatepassword
      ])],
      confirm: ['', Validators.required]

    }, { validator: this.matchingpassword('password', 'confirm') });
  }
  disableform() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }
  enableform() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }
  validatemail(controls) {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatemail': true }
    }
  }

  validateusername(controls) {
    const regExp = new RegExp(
      /^[a-zA-Z0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateusername': true }
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

  matchingpassword(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingpassword': true };
      }
    }
  }

  onregister() {
    this.processing = true;
    this.disableform();
    this.loading = true;
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    }

    this.authservice.registeruser(user).subscribe(data => {
      if (!data.success) {
        this.msgService.message({level: NgxMsgLevel.Error, text: data.message});
        this.processing = false;
        this.enableform();
        this.loading = false;
      } else {
        this.msgService.message({level: NgxMsgLevel.Success, text: data.message});
        this.loading = false;
      }
    });
  }
  ngOnInit() {
  }

}
