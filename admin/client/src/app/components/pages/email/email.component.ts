import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthadminService } from '../../../services/authadmin.service';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  form: FormGroup;
  processing = false;
  constructor(
    private formbuilder: FormBuilder,
    private authadmin: AuthadminService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
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
        this.validemail
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
      return { 'validemail': true }
    }
  }

  disableform() {
    this.form.controls['email'].disable();
  }

  enableform() {
    this.form.controls['email'].enable();
  }

  onresetmail() {
    this.processing = true;
    this.disableform();
    this.spinner.show();
    const email = {
      email: this.form.get('email').value
    }

    this.authadmin.resetemail(email).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;
        this.enableform();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
       }
    });
  }
  ngOnInit() {
  }

}
