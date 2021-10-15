import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'src/app/common/alert.service';

@Component({
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css']
})
export class PublicHeaderComponent implements OnInit {
  instanceSettingObj: any;

  constructor(private commonService: CommonService,
              private titleService: Title,
              private alertService:AlertService) {
    this.instanceSettingObj = {}; 
  }

  ngOnInit() {
    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general","localization","googleApiSettings"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
      
      this.instanceSettingObj.logo = '/api/v1/common/file/'+success['data'].general.logo;
      this.instanceSettingObj.orgName = success['data'].general.organizationName;
      this.instanceSettingObj.dateFormat = success['data'].localization.dateFormat;
      this.instanceSettingObj.timeZone = success['data'].localization.timeZone;
      this.instanceSettingObj.googleApiKey = success['data'].googleApiSettings.apiKey;
      this.instanceSettingObj.domainName = success['data'].general.domainName;

      this.titleService.setTitle(this.instanceSettingObj.domainName+": Certificate Details");


    }, error => {
      this.alertService.showError(error.message);
    }) 
  }
}
