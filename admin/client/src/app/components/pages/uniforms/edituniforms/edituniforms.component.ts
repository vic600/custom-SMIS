import { Component, OnInit } from '@angular/core';
import { UniformsService } from '../../../../services/uniforms.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edituniforms',
  templateUrl: './edituniforms.component.html',
  styleUrls: ['./edituniforms.component.css']
})
export class EdituniformsComponent implements OnInit {

  currenturl;
  processing = false;
  hide = true;
  uniform = {
    _id: String,
    product: String,
    price: Number,
    stock: Number
  };
  constructor(
    private uniformservice: UniformsService,
    private activatedroute: ActivatedRoute,
    private msgService: NgxMsgService, private configService: NgxMsgConfigService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private location: Location
  ) {

    configService.position = NgxMsgPosition.BottomLeft;
    configService.visibleTime = 5000;
    configService.closeOnClick = false;
  }


  goback() {
    this.location.back();
  }
  onedit() {
    this.processing = true;

    this.spinner.show();
    this.uniformservice.edituniform(this.uniform).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
        this.processing = false;

      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/uniforms']);
        }, 6000);
      }
    });
  }
  ngOnInit() {
    this.spinner.show();
    this.currenturl = this.activatedroute.snapshot.params;
    this.uniformservice.getuniform(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();
      } else {
        this.msgService.message({ level: NgxMsgLevel.Success, text: data.message });
        this.spinner.hide();
        this.uniform = data.uniform;
        this.hide = false;
      }
    });
  }

}
