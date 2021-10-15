import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { AlertService } from '../../../common/alert.service';
import { CommonService } from '../../../common/common.service';
import { AuthenticationService } from '../../../common/authentication.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import * as moment from 'moment-timezone';
declare var $: any,Tagify:any;

@Component({
    selector: 'app-dashboard-certificate',
    templateUrl: './certificate.component.html',
    styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
    certificateList = [];
    batchList :any = [];
    totalItems = 0;
    start:any = 0;
    end:any = 0;
    currentPage = 1;
    perPage = 20;
    currentUserId;
    role;
    mailingList;
    tagify;
    currentCertificate;
    currentIssuerAddress;
    currentCertificateId;
    currentFileId;
    privateKey;
    @ViewChild("form")
    form;
    autoRefresh: boolean;
    autoRefreshInterval: any;
    filter:any;
    recipientStatus = false;
    seletcedBatchId:any = false; 
    instanceSettingObj:any = {};
    authData:any;


    constructor(private certificateService: CertificateService, 
                private alertService: AlertService,
                private router:Router,
                private commonService: CommonService,
                private titleService: Title,
                private authenticationService:AuthenticationService) {
        this.filter = {
            status:'ALL',
            batchID:'ALL',
            recipientName:''
        }            
    }
    ngOnInit() {

        this.authData = this.authenticationService.getCurrentAuthData();
        this.role     = this.authData.role;
        
        var input = document.getElementById('tagged');
        this.tagify = new Tagify(input, {whitelist:[]});

        this.autoRefresh = false;
        try{
            clearInterval(this.autoRefreshInterval);
        }
        catch(e)
        {

        }
        this.getInstanceSetting();

        this.getAllCertificates(this.currentPage, this.perPage, this.filter);  
        // this.toggleAutoRefresh();
        // this.getRecipientStatus();

        this.getBatchListing();
        
        setTimeout(() => {
            $('#batchID').selectpicker('refresh');

            if(this.filter.batchID != 'ALL'){
                this.seletcedBatchId = this.filter.batchID;                
            }else{
                this.seletcedBatchId = false;
            }

        }, 1000);
        
        
    }

    getInstanceSetting(){
        let paramData = ["general","localization"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            
            this.instanceSettingObj.dateFormat = success['data'].localization.dateFormat;
            this.instanceSettingObj.timeZone = success['data'].localization.timeZone;
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Issued Certificate");

        }, error => {
            // this.alertService.showError(error.message);
            console.log('Instance Settings Error: ',error.message);
        }) 
    }

    getBatchListing(){
        this.certificateService.getBatchListing().subscribe(success => {
            this.batchList = success['data'];
        }, error => {
            this.seletcedBatchId = false;
            // this.alertService.showError(error.message);
            console.log('Batch Listing Error: ',error.message);
        })
    }

    ngOnDestroy(){
        clearInterval(this.autoRefreshInterval);
    }

    toggleAutoRefresh() {
        if (this.autoRefresh == true) {
            this.autoRefresh = false;
            clearInterval(this.autoRefreshInterval);
        }
        else {
            this.autoRefresh = true;
            this.autoRefreshInterval = setInterval(() => {
                this.getAllCertificates(this.currentPage, this.perPage, this.filter);
            }, 5000);
        }
    }
    
    toggleRefresh(){
        this.getAllCertificates(this.currentPage, this.perPage, this.filter);
    }

    getAllCertificates(pageNumber, limit,filter) {
        this.certificateService.getCertificates(pageNumber, limit,filter).subscribe(success => {
            this.certificateList = success['data']['data'];
            this.totalItems = success['data']['count'];

            if (this.instanceSettingObj.dateFormat == undefined) {
                this.instanceSettingObj.dateFormat = 'DD/MM/YYYY';
            }

            if(this.certificateList.length > 0){
                this.certificateList.forEach((data,index)=>{
                    this.certificateList[index].rawCertificate.issuedOn = moment(data.rawCertificate.issuedOn).format(this.instanceSettingObj.dateFormat);
                });
            }

            this.start = (pageNumber - 1) * this.perPage + 1;
            this.end = (pageNumber - 1) * this.perPage + this.certificateList.length;
        }, error => {
            // this.alertService.showError(error.message);
            console.log('Certificate Listing Error:',error.message);
        })
    }

    viewCertificate(id,isClaimed) {
        if(this.role!='ROLE_RECIPIENT'){
            if(!isClaimed){
                this.alertService.showError("Certificate is not claimed");
                return;
            }
            this.router.navigate(['/dashboard/certificate',id]);                                    
        }else{
            this.router.navigate(['/dashboard/certificate',id]);                   
        }
    }

    openClaimCertificateModal(certificate){
        this.currentCertificateId = certificate._id;
        if(certificate.isClaimed){
            this.alertService.showError("Certificate is already claimed");            
            return;
        }
        $("#claimCertificate").modal('show');
    }

    toggleClaimCertificate(currentCertificateId){
		try{
			let _promise = this.certificateService.claimCertificate(currentCertificateId).toPromise();
			_promise.then((response:any)=>{
				if(response['status']=='success'){
                    this.alertService.showSuccess(response['message']);
                    this.getAllCertificates(this.currentPage,this.perPage,this.filter);
                    $("#claimCertificate").modal('hide'); 
				}
			}).catch(e=>{
				this.alertService.showError(e.error.message);
			})
		}catch(error){
			this.alertService.showError(error.message);
		}
	}

    openShareUrlModal(certificate){
        if(!certificate.isClaimed){
            this.alertService.showError("You need to claim your certificate before you share");
            return;
        }
        this.currentCertificate = certificate;
        this.tagify.removeAllTags();
        $('#shareDocsModal').modal('show');
    }

    inviteVerifier(){
        if(this.tagify.value.length==0){
            this.alertService.showError("Please enter atleast one email");
            return;
        }
        let emailArray = this.tagify.value.map(v=>v.value); 
        this.certificateService.shareCertificate(emailArray,this.currentCertificate._id,this.currentCertificate.issuedBy._id).subscribe(success=>{
            this.alertService.showSuccess(success['message']);
            $('#shareDocsModal').modal('hide');        
        },error=>{
            this.alertService.showError(error.message);            
        })
    }
    isClamied(clamied) {
        if (clamied) {
            return "YES";
        } else {
            return "NO"
        }
    }
    
    parseStatus(status){
        if(status=='UNDER_PROGRESS'){
            return "IN PROGRESS";
        }else{
            return status;
        }
    }
    pageChange(page) {
        if (!isNaN(page)) {
            this.getAllCertificates(page, this.perPage,this.filter);
        }
    }

    /* getRecipientStatus() {
        this.certificateService.getLoggedInUserInfo().subscribe(success => {
            if (success['data'].status == '1') {
                this.recipientStatus = true;
            }
            else if(success['data'].status == '0')
            {
                this.recipientStatus = false;
            }
        }, error => {
            this.alertService.showError(error.message);
        })
    } */

    downloadBatchCertificate(){
        if(this.seletcedBatchId == false){
            this.alertService.showError("There is not batch available");
            return false;
        }

        window.open('/api/v1/common/file/'+this.seletcedBatchId+'.zip?entity=batch_zip');

    }

    exportCSV() {
        if (this.seletcedBatchId == false) {
            this.alertService.showError('There is not batch available');
            return false;
        }

        window.open('/api/v1/common/export_csv/' + this.seletcedBatchId);
    }
}