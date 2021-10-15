import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { AlertService } from '../../../common/alert.service';
import { CommonService } from '../../../common/common.service';
import { AuthenticationService } from '../../../common/authentication.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-certificate-revoke-listing',
  templateUrl: './certificate-revoke-listing.component.html',
  styleUrls: ['./certificate-revoke-listing.component.css']
})
export class CertificateRevokeListingComponent implements OnInit {
  certificateList = [];
  currentPage = 1;
  perPage = 20;
  totalItems = 0;
  start;
  end;
  filter:any = {};
  autoRefreshInterval:any;
  autoRefresh:any;
  role:any = false;
  recipientStatus:any = false;
  instanceSettingObj:any = {};

  authData:any;

  constructor(private certificateService: CertificateService,
              private alertService: AlertService,
              private router:Router,
              private commonService: CommonService,
              private titleService: Title,
              private authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.filter = {
      isRevoked:true,
      status: 'ALL'
    } 

    this.authData = this.authenticationService.getCurrentAuthData();
    this.role     = this.authData.role;

    this.getAllCertificates(this.currentPage, this.perPage, this.filter); 

    this.getInstanceSetting();
  }

  ngOnDestroy(){
    clearInterval(this.autoRefreshInterval);
}

getInstanceSetting(){
  let paramData = ["general","localization"];
  this.commonService.getInstanceSetting(paramData).subscribe(success => {
      
      this.instanceSettingObj.dateFormat = success['data'].localization.dateFormat;
      this.instanceSettingObj.timeZone = success['data'].localization.timeZone;
      this.instanceSettingObj.domainName = success['data'].general.domainName;
        
      this.titleService.setTitle(this.instanceSettingObj.domainName+": Certificate Revoke");

  }, error => {
      // this.alertService.showError(error.message);
      console.log('Instance Settings Error: ',error.message);
  }) 
}

toggleAutoRefresh(){
    if(this.autoRefresh == true)
    {
        this.autoRefresh = false;
        clearInterval(this.autoRefreshInterval);
    }
    else
    {
        this.autoRefresh = true;    
        this.autoRefreshInterval = setInterval(() => {
            this.getAllCertificates(this.currentPage, this.perPage,this.filter);    
        },5000);
    }
  }

  getAllCertificates(pageNumber, limit,filter){
    this.certificateService.getCertificates(pageNumber, limit,filter).subscribe(success => {
        this.certificateList = success['data']['data'];

      if (this.instanceSettingObj.dateFormat == undefined) {
        this.instanceSettingObj.dateFormat = 'DD/MM/YYYY';
      }
        
      if(this.certificateList.length > 0){
        this.certificateList.forEach((data,index)=>{
              this.certificateList[index].revocationDetails.revocationDate = moment(data.revocationDetails.revocationDate).format(this.instanceSettingObj.dateFormat);
          });
      }

        this.totalItems = success['data'].count;
        this.start = (pageNumber - 1) * this.perPage + 1;
        this.end = (pageNumber - 1) * this.perPage + this.certificateList.length;
    }, error => {
        // this.alertService.showError(error.message);
        console.log('Revocation Listing Error: ',error.message);
    })
  }

  viewCertificate(_certificateId,isClaimed){
    if(!isClaimed){
      this.alertService.showError("Certificate is not claimed");
      return;
    }
    this.router.navigate(['/dashboard/certificate',_certificateId]);
  }
}
