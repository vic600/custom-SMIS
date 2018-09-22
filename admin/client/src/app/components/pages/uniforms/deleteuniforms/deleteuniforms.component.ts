import { Component, OnInit } from '@angular/core';
import { UniformsService } from '../../../../services/uniforms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { INgxMsgOptions, NgxMsgPosition, NgxMsgLevel, NgxMsgService, NgxMsgConfigService } from 'ngx-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
@Component({
  selector: 'app-deleteuniforms',
  templateUrl: './deleteuniforms.component.html',
  styleUrls: ['./deleteuniforms.component.css']
})
export class DeleteuniformsComponent implements OnInit {
  currenturl;
  kit = {
    product: String,
  };
  hide = true;
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
  ondelete() {
    this.spinner.show();
    this.uniformservice.deleteuniform(this.currenturl.id).subscribe(data => {
      if (!data.success) {
        this.msgService.message({ level: NgxMsgLevel.Error, text: data.message });
        this.spinner.hide();

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
        this.kit = data.uniform;
        this.hide = false;
      }
    });
  }

}
