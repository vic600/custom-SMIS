import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthadminService } from '../../../services/authadmin.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  processing = false;
  constructor(
    private formbuilder: FormBuilder,
    private authadmin: AuthadminService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private router: Router,
    private spinner: NgxSpinnerService
   
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
        this.validateemail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        this.validateusername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatepassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingpassword('password', 'confirm') });
  }

  validateemail(controls) {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateemail': true }
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
        return { 'matchingpassword': true }
      }
    }
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
  onregister() {
    this.spinner.show();
    this.processing = true;
    this.disableform();
    const admin = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
    this.authadmin.registeradmin(admin).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 2000);
      }
    });

  }
  ngOnInit() {
  }

}
