import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../common/alert.service';
import { CertificateService } from '../certificate/certificate.service';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
declare var $: any;

@Component({
    selector: 'app-dashboard-shared-certificate',
    templateUrl: './shared.certificate.component.html',
    styleUrls: ['./shared.certificate.component.css']
})
export class SharedCertificateComponent implements OnInit {
    certificateList = [];
    totalItems = 0;
    start:any = 0;
    end:any = 0;
    currentPage = 1;
    currentCertificateId;
    requestMessage;
    certificate:any=[];
    instanceSettingObj:any = {};

    @ViewChild("form")
    form;
    
    ngOnInit() 
    {
        this.getInstanceSetting();

        this.getAllCertificates(this.currentPage, 10);

        //Check certificateID exist in localStorage or sessionStoarge
        let certificateID  = localStorage.getItem('certificateID');
        if(!certificateID){
            certificateID = sessionStorage.getItem('certificateID');
        }

        if(certificateID){
            this.certificateService.shareCertificateWithVerifier(certificateID).subscribe(success =>{
                localStorage.removeItem('certificateID');
                sessionStorage.removeItem('certificateID');
                this.alertService.showSuccess(success['message']);
                this.ngOnInit();
            },error =>{
                localStorage.removeItem('certificateID');
                sessionStorage.removeItem('certificateID');
                this.alertService.showError(error.message);
            })
        }
    }

    getInstanceSetting(){
        let paramData = ["general","localization"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {

            this.instanceSettingObj.dateFormat = success['data'].localization.dateFormat;
            this.instanceSettingObj.timeZone = success['data'].localization.timeZone;
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Shared Certificate(s)");

        }, error => {
            // this.alertService.showError(error.message);
            console.log('Instance Settings Error: ',error.message);
        }) 
    }

    constructor(private alertService: AlertService, 
                private certificateService: CertificateService,
                private router:Router,
                private commonService: CommonService,
                private titleService: Title) {

    }

    getAllCertificates(pageNumber, limit) {
        this.certificateService.getSharedCertificate(pageNumber, limit).subscribe(success => {
            this.certificateList = success['data']['data'];
            this.totalItems = success['data']['count'];

            if (this.instanceSettingObj.dateFormat == undefined) {
                this.instanceSettingObj.dateFormat = 'DD/MM/YYYY';
            }

            if(this.certificateList.length > 0){
                this.certificateList.forEach((data,index)=>{
                    this.certificateList[index].certificateId.rawCertificate.issuedOn = moment(data.certificateId.rawCertificate.issuedOn).format(this.instanceSettingObj.dateFormat);
                });
            }

            this.start = (pageNumber - 1) * 10 + 1;
            this.end = (pageNumber - 1) * 10 + this.certificateList.length;
        }, error => {
            // this.alertService.showError(error.message);
            console.log('Shared Certificate Listing Error: ',error.message);
        })
    }

    pageChange(page) {
        if (!isNaN(page)) {
            this.getAllCertificates(page, 10);
        }
    }

    viewCertificate(id,isClaimed){
        if(!isClaimed){
            this.alertService.showError("You can not view this certificate, because recipient has not claimed");
            return;
        }
        this.router.navigate(['/dashboard/certificate',id]);          
    }

    requestForVerification(_id){
        this.form.resetForm();
        this.currentCertificateId = _id;
        $("#verificationRequestModal").modal('show');
    }

    verificationRequest(form){
        if(form.invalid) return;
        // console.log(this.form.value);
        // return;
        this.certificateService.sendVerificationRequest(this.currentCertificateId,this.requestMessage).subscribe(success=>{
            this.alertService.showSuccess(success['message']);
            $("#verificationRequestModal").modal('hide');  
            form.resetForm();          
        },error=>{
            this.alertService.showError(error.message);            
        })
    }
}