import { Component, OnInit, group } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  form: FormGroup;
  processing = false;
  constructor(
    private frombuilder: FormBuilder,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private userservice: UserService,
    private router: Router
  ) {
    this.createform();
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.frombuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        this.validemail
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

  validemail(controls) {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validemail': true }
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

  onadduser() {
    this.processing = true;
    this.disableform();
    this.spinner.show();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.userservice.adduser(user).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/users'])
        }, 6000);
      }
    });
  }
  ngOnInit() {
  }

}
