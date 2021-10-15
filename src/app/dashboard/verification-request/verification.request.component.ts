import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../common/alert.service';
import { CertificateService } from '../certificate/certificate.service';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { AuthenticationService } from '../../common/authentication.service';
import { Title } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-dashboard-verification-request',
    templateUrl: './verification.request.component.html',
    styleUrls: ['./verification.request.component.css']
})
export class VerificationRequestComponent implements OnInit {
    requests = [];
    totalItems = 0;
    start:any = 0;
    end:any = 0;
    currentPage = 1;
    perPage = 20;
    currentVerificationId;
    responseMessage;
    currentMessage;
    instanceSettingObj:any = {};
    authData:any;

    @ViewChild("form")
    form;
    role
    

    constructor(private alertService: AlertService, 
                private certificateService: CertificateService,
                private router:Router,
                private commonService: CommonService,
                private titleService: Title,
                private authenticationService:AuthenticationService) {

    }

    ngOnInit() {
        this.getVerificationList(this.currentPage, this.perPage);
        /* this.getInstanceSetting(); */

        this.authData = this.authenticationService.getCurrentAuthData();
        this.role     = this.authData.role;
    }

    /* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": verification Request");

        }, error => {
            // this.alertService.showError(error.message);
            console.log('Instance Settings Error: ',error.message);
        }) 
    } */

    getVerificationList(pageNumber, limit) {
        this.certificateService.getVerificationList(pageNumber, limit).subscribe(success => {
            this.requests = success['data']['data'];
            this.totalItems = success['data']['count'];
            this.start = (pageNumber - 1) * this.perPage + 1;
            this.end = (pageNumber - 1) * this.perPage + this.requests.length;
        }, error => {
            // this.alertService.showError(error.message);
            console.log('verification request listing error: ',error.message);
        })
    }

    pageChange(page) {
        if (!isNaN(page)) {
            this.getVerificationList(page, this.perPage);
        }
    }

    viewCertificate(id) {
        this.router.navigate(['/dashboard/certificate',id]);
    }

    revert(_id) {
        this.form.resetForm();
        this.currentVerificationId = _id;
        $("#sendMessage").modal('show');
    }

    sendMessage(form) {
        if (form.invalid) return;
        this.certificateService.sendMessage(this.currentVerificationId, this.responseMessage).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            $("#sendMessage").modal('hide');
            form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    viewMessage(requestMessage){
        this.currentMessage = requestMessage;
        $("#viewMessage").modal('show');
    }
}