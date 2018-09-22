import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../../../services/meals.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
@Component({
  selector: 'app-addmenu',
  templateUrl: './addmenu.component.html',
  styleUrls: ['./addmenu.component.css']
})
export class AddmenuComponent implements OnInit {
  form: FormGroup;
  processing = false;
  constructor(
    private mealservice: MealsService,
    private formbuilder: FormBuilder,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private location: Location
  ) {
    this.createform();
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }

  createform() {
    this.form = this.formbuilder.group({
      food: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
        this.validfood
      ])],
      price: ['', Validators.compose([
        Validators.required,
        this.validprice
      ])]
    });
  }
  validfood(controls) {
    const regExp = new RegExp(
      /^[a-zA-Z]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validfood': true }
    }
  }
  validprice(controls) {
    const regExp = new RegExp(
      /^[0-9]+$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'vaidprice': true }
    }

  }

  disableform() {
    this.form.controls['food'].disable();
    this.form.controls['price'].disable();
  }

  enableform() {
    this.form.controls['food'].enable();
    this.form.controls['price'].enable();
  }
  goback() {
    this.location.back();
  }
  onadd() {
    this.spinner.show();
    this.processing = true;
    this.disableform();
    const menu = {
      food: this.form.get('food').value,
      price: this.form.get('price').value
    }
    this.mealservice.addfood(menu).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.processing = false;
        this.enableform();
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {

          this.router.navigate(['/menu']);
        }, 6000);
      }
    });
  }
  ngOnInit() {
  }

}
