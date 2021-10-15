import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard/dashboard.service';
import { CommonService } from '../../common/common.service';
import { Title } from '@angular/platform-browser';
import { AlertService } from '../../common/alert.service';
import { AuthenticationService } from 'src/app/common/authentication.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


declare var $:any;

@Component({
    selector:'app-dashboard-main',
    templateUrl:'./main.component.html',
    styleUrls:['./main.component.css']
})
export class MainComponent implements OnInit{

    role:any;
    dashboardData:any = {};
    public chartDatasets: Array<any>;
    public chartLabels: Array<any>;
    public chartColors: Array<any>;
    instanceSettingObj:any = {};

    constructor(private dashboardService:DashboardService,
                private commonService: CommonService,
                private titleService: Title,
                private authenticationService:AuthenticationService,
                private ngxService: NgxUiLoaderService,
                private alertService:AlertService) {

        this.dashboardData = {
            "issuedCertificateCount": 0, 
            "verificationRequestCount": 0, 
            "recipientCount": 0, 
            "issuerCount":0,
            "verifierCount":0,
            "userCount": 0
        };
     }

    ngOnInit(){
        /* let role = localStorage.getItem('role');
        if (!role) {
            role = sessionStorage.getItem('role')
        } */

        let authData = this.authenticationService.getCurrentAuthData();
        this.role = authData['role'];
        this.ngxService.start();
        this.dashboardService.getDashboardDetails().subscribe(success => {
            this.ngxService.stop();
            this.dashboardData = success['data'];       
        });

        this.getInstanceSetting();
    }

    getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            // this.titleService.setTitle(this.instanceSettingObj.domainName+": Dashboard");

        }, error => {
            this.alertService.showError(error.message);
        }) 
    }

    public chartType: string = 'line';
  
    // public chartColors: Array<any> = [
    //   {
    //     backgroundColor: 'rgba(105, 0, 132, .2)',
    //     borderColor: 'rgba(200, 99, 132, .7)',
    //     borderWidth: 2,
    //   },
    //   {
    //     backgroundColor: 'rgba(0, 137, 132, .2)',
    //     borderColor: 'rgba(0, 10, 130, .7)',
    //     borderWidth: 2,
    //   }
    // ];
  
    public chartOptions: any = {
      responsive: true
    };
    public chartClicked(e: any): void { }
    public chartHovered(e: any): void { }
    
}