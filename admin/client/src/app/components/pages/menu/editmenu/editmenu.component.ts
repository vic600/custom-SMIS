import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../../../services/meals.service';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-editmenu',
  templateUrl: './editmenu.component.html',
  styleUrls: ['./editmenu.component.css']
})
export class EditmenuComponent implements OnInit {

  processing = true;
  meal={
    _id:String,
    food:String,
    price:Number
  };
  hide = true;
  currenturl;
  
  constructor(
    private mealservice: MealsService,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private location: Location,
    private activatedroute: ActivatedRoute
  ) {
    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }
 
  goback() {
    this.location.back();
  }
  onedit() {
    this.processing = true,
      this.spinner.show();
 
    this.mealservice.editfood(this.meal).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;
        
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
        
        this.hide = false;
        this.meal = data.food;
      }
    })
  }

}
