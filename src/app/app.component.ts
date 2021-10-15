import { Component } from '@angular/core';
import { CommonService } from './common/common.service';
import { AlertService } from './common/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blockchain-certification';
  instanceSettingObj: any = {};

  constructor(
    private commonService: CommonService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.commonService.initTitle();
  }

  

  



}
