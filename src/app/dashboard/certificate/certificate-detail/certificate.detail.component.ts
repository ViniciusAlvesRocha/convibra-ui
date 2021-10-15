import { Component, OnInit, OnDestroy } from '@angular/core';
import { CertificateService } from '../../certificate/certificate.service';
import { CommonService } from '../../../common/common.service';
import { AuthenticationService } from '../../../common/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../common/alert.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
import { NgxUiLoaderService } from 'ngx-ui-loader';

// import moment = require('moment-timezone');
declare var google: any, $: any;

@Component({
    selector: 'app-dashboard-cert-detail',
    templateUrl: './certificate.detail.component.html',
    styleUrls: ['./certificate.detail.component.css']
})
export class CertificateDetailComponent implements OnInit,OnDestroy {
    certificateInfo;
    certificateUrl: SafeResourceUrl;
    qrCertificateData;
    role;
    activeCertificate: any;
    certificateHistoryList = [];
    totalItems = 0;
    start;
    end;
    issuedToId: any;
    currentPage = 1;
    perPage = 20;

    authData:any;

    instanceSettingData: any;
    insuanceRevocationData: any;
    qrCodeObject: {};
    courseName:any;
    extraData:any;
    generatedFile:any = [];
    instanceSettingObj:any = {};
    mapInitFirstTime:boolean = false;
    certificateListingLink = '/dashboard/certificate';
    

    constructor(private certificateService: CertificateService, 
                private activatedRoute: ActivatedRoute, 
                private alertService: AlertService, 
                private commonService: CommonService,
                public sanitizer: DomSanitizer, 
                private location:Location, 
                private router:Router,
                private titleService: Title,
                private authenticationService:AuthenticationService,
                private ngxUiLoaderService: NgxUiLoaderService) {

    }

    ngOnInit() {
        /* let role = localStorage.getItem('role');
        if (!role) {
            role = sessionStorage.getItem('role')
        }
        this.role = role; */

        
        this.authData = this.authenticationService.getCurrentAuthData();
        this.role     = this.authData.role;

        if(this.role == 'ROLE_VERIFIER'){
            this.certificateListingLink = '/dashboard/certificate/shared';
        }

        this.activeCertificate = false;

        this.issuedToId = false;
       
        

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

          /* Certificate Details  */
          this.ngxUiLoaderService.start();
          this.getCertificateInfo(); 


        }, error => {
          this.alertService.showError(error.message);
        }) 
      }

    getCertificateHistoryDetails(pageNumber, limit,issuedToId,courseName) {

        this.certificateService.getCertificateHistoryDetails(pageNumber, limit,issuedToId,courseName).subscribe(success => {
            this.certificateHistoryList = success['data']['data'];
            this.totalItems = success['data']['count'];
            this.start = (pageNumber - 1) * this.perPage + 1;
            this.end = (pageNumber - 1) * this.perPage + this.certificateHistoryList.length;

            if (this.instanceSettingObj.dateFormat == undefined) {
                this.instanceSettingObj.dateFormat = 'DD/MM/YYYY';
            }

            if(this.certificateHistoryList.length > 0){
                this.certificateHistoryList.forEach((history,index)=>{
                    this.certificateHistoryList[index].rawCertificate.issuedOn = moment(history.rawCertificate.issuedOn).format(this.instanceSettingObj.dateFormat);
                });
            }
           
        }, error => {
            this.alertService.showError(error.message);
        });
      
    }

    isClamied(clamied) {
        if (clamied) {
            return "YES";
        } else {
            return "NO"
        }
    }

    pageChange(page) {
        if (!isNaN(page)) {
            this.getCertificateHistoryDetails(this.currentPage, this.perPage, 
                this.issuedToId,
                this.courseName
            );
        }
      }

    initializeGoogleMap() {
        var self = this;
        window['initMap'] = function initMap() {
            var address = self.certificateInfo['issuedBy']['companyName'] + " " + self.certificateInfo['issuedBy']['companyAddress'];
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var position = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                    // The map, centered
                    var map = new google.maps.Map(
                        document.getElementById('map'), { zoom: 14, center: position });
                    // The marker
                    var marker = new google.maps.Marker({ position: position, map: map });
                }
            });
        }
        var script = document.createElement('script');
        script.innerHTML = '';
        //  AIzaSyBPPQRCfhN_rtKU9hUQm867ZS_I6i-jCx4
        script.src = "https://maps.googleapis.com/maps/api/js?key="+this.instanceSettingObj.googleApiKey+"&callback=initMap";
        script.async = true;
        script.defer = true;
        script.id="appGoogleMap";
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    switchCertificate()
    {
        if(this.activeCertificate == ""){
            this.alertService.showError("Please select valid certificate");
            return;
        }
        
        let url = this.getCertificateUrl(this.activeCertificate);
        $('#previewIframe').attr('src', url);
    }

    getCertificateInfo() {
        let certId = this.activatedRoute.snapshot.params.id;
        this.certificateService.getCertificateInfo(certId).subscribe(success => {
            this.certificateInfo = success['data']['certificateData'];
            this.instanceSettingData = success['data']['instanceSettingData'];
            /* this.insuanceRevocationData = success['data']['insuanceRevocationData']; */

            if (this.instanceSettingObj.dateFormat == undefined) {
                this.instanceSettingObj.dateFormat = 'DD/MM/YYYY';
            }

            this.certificateInfo.rawCertificate.issuedOn = moment(this.certificateInfo.rawCertificate.issuedOn).format(this.instanceSettingObj.dateFormat);

            if(this.certificateInfo.generatedFiles != undefined && 
               this.certificateInfo.generatedFiles.length > 0 &&
               this.certificateInfo.generatedFiles[0].file != undefined){
                this.activeCertificate = this.certificateInfo.generatedFiles[0].file;
            }    

            this.extraData = Object.entries(this.certificateInfo.extraData).map(([key, value]) => ({key,value}));
            this.generatedFile = this.certificateInfo.generatedFiles;

                         
            this.issuedToId = this.certificateInfo.issuedTo._id;
            this.courseName = this.certificateInfo.course.Lang1;

            
            let qrUrl = `${location.origin}/public/certificate/${this.certificateInfo._id}`;
            this.qrCodeObject = { 
                'issuer':this.certificateInfo.issuedBy.address,
                'certificateHash':this.certificateInfo.signedCertificate.signature.targetHash,
                'merkleRoot':this.certificateInfo.signedCertificate.signature.merkleRoot,
                'certificateStoreMainnet':this.certificateInfo.rawCertificate.additionalData.certificateStore.mainnet,
                'certificateStoreUniblocknet':this.certificateInfo.rawCertificate.additionalData.certificateStore.uniblocknet,
                'certificateURL': qrUrl
            };

            this.qrCertificateData = JSON.stringify(this.qrCodeObject);
            

            this.getCertificateHistoryDetails(this.currentPage, this.perPage, 
                this.issuedToId,
                this.courseName
                );
            
            setTimeout(function () {
                $("select#loadedCertificate").selectpicker("refresh");
            }, 1000);    

        }, error => {
            this.alertService.showError(error.message);
        })
    }

    toTitleCase(str){
        let result = str.replace( /([A-Z])/g, " $1" );
        let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult;
    }

    async viewCertificate(fileId) {
        window.open(this.getCertificateUrl(fileId), '_blank');
    }


    getCertificateUrl(file) {
        let url = `/api/v1/common/file/${file}`;
        return url;
    }

    ngOnDestroy(){
        // remove google map script
        var scripts = document.querySelectorAll("script[src*='maps.googleapis.com']");
        for(var i = 0; i < scripts.length; i++) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }

    goBack() {
        // window.history.back();
        this.location.back();

    }

    viewCertificateHistory(id) {
        window.open('/dashboard/certificate/'+id, "_blank");
    }

    onTabChanged(event){
       /* PDF Details */
        if(event.index == 3){
            let url = this.getCertificateUrl(this.activeCertificate);
            $('#previewIframe').attr('src', url);
        }
        
        /* Certificate Location */
        if(event.index == 4 && this.mapInitFirstTime == false){
             // pin addres at google map
             this.initializeGoogleMap();
             this.mapInitFirstTime = true;
        }
    }

}