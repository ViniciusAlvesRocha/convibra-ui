import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'src/app/common/alert.service';
import { BlockExplorerService } from '../block-explorer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-block-details',
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.css']
})
export class BlockDetailsComponent implements OnInit {
  instanceSettingObj: any = {};

  blockDetails:any = {
    hashOrNumber:0,
    details:{},
    error:false,
    loaded:false
  }
  baseRoute: string;
  isPublic: boolean;


  constructor(private activatedRoute:ActivatedRoute,
              private commonService: CommonService,
              private titleService: Title,
              private router: Router,
              private alertService:AlertService,
              public _location:Location,
              private blockExplorerService: BlockExplorerService) {
    this.baseRoute = '/dashboard/block-explorer/';      
    this.isPublic = false;      
  }

  ngOnInit() {
    /* this.getInstanceSetting(); */

    /* Get Block Details*/
    this.activatedRoute.params.subscribe(_params => {
      this.blockDetails.hashOrNumber = _params.hashOrNumber;
      this.getBlockDetails();
    });
    
    if(this.router.url.includes("public"))
    {
        this.baseRoute = '/public/block-explorer/';
        this.isPublic = true;
    }
  }

  /* getInstanceSetting() {
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
      this.instanceSettingObj.domainName = success['data'].general.domainName;
      this.titleService.setTitle(this.instanceSettingObj.domainName + ": Block Summary");

    }, error => {
      this.alertService.showError(error.message);
    })
  } */

  getBlockDetails(){
    
    this.blockExplorerService.getBlockDetails(this.blockDetails.hashOrNumber)
    .subscribe((response:any) =>{
      this.blockDetails.loaded = true;
      if(response.status == 'success')
      {
        this.blockDetails.details = response.data;

      }
      else
      {
        this.alertService.showError(response.message);
      }
    }, error => {
      this.blockDetails.loaded = true;
      this.alertService.showError(error.message)
      this.blockDetails.error = error.message;
    })
  }

  back(){
    this._location.back();
  }
}
