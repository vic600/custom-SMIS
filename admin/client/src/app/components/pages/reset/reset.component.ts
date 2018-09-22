import { Component, OnInit, group } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthadminService } from '../../../services/authadmin.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  form: FormGroup
  processing = false;
  currenturl;
  hide = true;
  manager;
  constructor(
    private formbuilder: FormBuilder,
    private authadmin: AuthadminService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private activatedroute: ActivatedRoute,
    private router: Router

  ) {
    this.createform();
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }
  createform() {
    this.form = this.formbuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(8),
        this.validatepassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingpasswords('password', 'confirm') });
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

  matchingpasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingpasswords': true }
      }
    }
  }
  disableform() {
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableform() {
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }
  onpass() {
    this.processing = true;
    this.disableform();
    this.spinner.show();
    const pass = {
      id: this.manager,
      password: this.form.get('password').value
    }
    this.authadmin.savepassword(pass).subscribe(data => {
      if (!data.success) {
        this.spinner.hide();
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.enableform();
        this.processing = false;
      } else {
        this.spinner.hide();
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 6000);
      }
    });
  }
  ngOnInit() {
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.authadmin.checktoken(this.currenturl.token).subscribe(data => {
      if (!data.success) {
        this.spinner.hide();
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.hide = false;
        this.manager = data.suser;
      }
    });
  }

}
