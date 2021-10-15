import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'src/app/common/alert.service';
import { BlockExplorerService } from '../block-explorer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tx-details',
  templateUrl: './tx-details.component.html',
  styleUrls: ['./tx-details.component.css']
})
export class TxDetailsComponent implements OnInit {

  instanceSettingObj: any = {};

  txDetails: any = {
    hash: 0,
    details: {},
    error: false,
    loaded: false
  }
  baseRoute: string;
  baseCertificateRoute: string;
  isPublic: boolean;


  constructor(private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private titleService: Title,
    private router: Router,
    private alertService: AlertService,
    private _location: Location,
    private blockExplorerService: BlockExplorerService) {

    this.baseRoute = '/dashboard/block-explorer/';
    this.baseCertificateRoute = '/dashboard/certificate/';
    this.isPublic = false;
  }

  ngOnInit() {
    /* this.getInstanceSetting(); */
    this.activatedRoute.params.subscribe(_params => {
      /* Get TX Details*/
      this.txDetails.hash = _params.hash;
      this.getTxDetails();
    });

    if(this.router.url.includes("public"))
    {
        this.baseRoute = '/public/block-explorer/';
        this.baseCertificateRoute = '/public/certificate/';
        this.isPublic = true;
    }
  }

  /* getInstanceSetting() {
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
      this.instanceSettingObj.domainName = success['data'].general.domainName;
      this.titleService.setTitle(this.instanceSettingObj.domainName + ": TX Summary");

    }, error => {
      this.alertService.showError(error.message);
    })
  } */

  getTxDetails() {

    this.blockExplorerService.getTxDetails(this.txDetails.hash)
      .subscribe((response: any) => {
        this.txDetails.loaded = true;
        if (response.status == 'success') {
          this.txDetails.details = response.data;

        }
        else {
          this.alertService.showError(response.message);
        }
      }, error => {
        this.txDetails.loaded = true;
        this.alertService.showError(error.message)
        this.txDetails.error = error.message;
      })



  }
}
