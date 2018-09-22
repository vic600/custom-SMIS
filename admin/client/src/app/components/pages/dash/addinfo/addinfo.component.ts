import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { InfoService } from '../../../../services/info.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addinfo',
  templateUrl: './addinfo.component.html',
  styleUrls: ['./addinfo.component.css']
})
export class AddinfoComponent implements OnInit {
  form: FormGroup;
  processing = false;
  constructor(
    private formuilder: FormBuilder,
    private infoservice: InfoService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.createform();
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        this.validtitle
      ])],
      motto: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        this.validmotto
      ])],
      address: ['', Validators.compose([
        Validators.required,
        this.validadress
      ])],
      phone: ['', Validators.compose([
        Validators.required,
        this.validphone
      ])],
      email: ['', Validators.compose([
        Validators.required,
        this.validemail
      ])]
    });
  }

  validtitle(controls) {
    const regExp = new RegExp(
      /^[A-Z]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validtitle': true }
    }
  }

  validmotto(controls) {
    const regExp = new RegExp(
      /^[a-z]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validmotto': true }
    }
  }

  validadress(controls) {
    const regExp = new RegExp(
      /^[a-zA-Z0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validaddress': true }
    }
  }
  validphone(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validphone': true }
    }
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
    this.form.controls['title'].disable();
    this.form.controls['motto'].disable();
    this.form.controls['phone'].disable();
    this.form.controls['email'].disable();
    this.form.controls['address'].disable();
  }
  enableform() {
    this.form.controls['title'].enable();
    this.form.controls['motto'].enable();
    this.form.controls['phone'].enable();
    this.form.controls['email'].enable();
    this.form.controls['address'].enable();
  }

  addinfo() {
    this.spinner.show();
    this.processing = true;
    this.disableform();
    const info = {
      title: this.form.get('title').value,
      motto: this.form.get('motto').value,
      address: this.form.get('address').value,
      phone: this.form.get('phone').value,
      email: this.form.get('email').value,
    }
    this.infoservice.addinfo(info).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.enableform();
        this.processing = false;
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/info']);
        }, 6000);
      }
    })
  }
  ngOnInit() {
  }

}
