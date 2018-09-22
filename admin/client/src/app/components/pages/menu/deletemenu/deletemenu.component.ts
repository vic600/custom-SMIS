import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../../../services/meals.service';
import { Router, ActivatedRoute } from '@angular/router';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-deletemenu',
  templateUrl: './deletemenu.component.html',
  styleUrls: ['./deletemenu.component.css']
})
export class DeletemenuComponent implements OnInit {
  currenturl;
  meal = {
    _id: String,
    food: String,
    price: String
  };
  hide = true;
  constructor(
    private mealservice: MealsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private router: Router,
    private spinner: NgxSpinnerService,
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
    this.mealservice.deletefood(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
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
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.mealservice.getmeal(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.meal = data.food;
        this.hide = false;
      }
    });
  }

}
