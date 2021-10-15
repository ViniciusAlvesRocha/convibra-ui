import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CertificateService } from '../dashboard/certificate/certificate.service';
import { CommonService } from '../common/common.service';
import { AlertService } from '../common/alert.service';
import { AuthenticationService } from '../common/authentication.service';
import { Title } from '@angular/platform-browser';
import * as ClientJS from 'clientjs';
import * as moment from 'moment-timezone';
declare var ClientJS:any;
declare var google: any, $: any;

@Component({
    selector:'app-dashboard-public-cert-detail',
    templateUrl:'./public.certificate.detail.component.html',
    styleUrls:['./public.certificate.detail.component.css']
})
export class PublicCertificateDetailComponent implements OnInit{
    certificateInfo;
    activeCertificate: any;
    certificateUrl:SafeResourceUrl;
    qrCertificateData;
    role:any = null;
    token:any = null;
    url:any;
    fingerprint:any;
    issuedToId: any;

    instanceSettingData: any;
    insuanceRevocationData: any;
    qrCodeObject: {};
    courseName:any;
    extraData:any;
    generatedFile:any = [];
    hideVerifyBtn = true;
    requestMessage:String;
    instanceSettingObj:any = {};
    authData:any;
    mapInitFirstTime:boolean = false;

    constructor(private certificateService:CertificateService,
               private activatedRoute:ActivatedRoute,
               private commonService: CommonService,
               private alertService:AlertService,
               public sanitizer:DomSanitizer, 
               private router: Router,
               private authenticationService:AuthenticationService,
               private titleService: Title){

    }

    ngOnInit(){
        this.activeCertificate = false;
        

        //Disable right click and f12
        window.onload = function() {
            document.addEventListener("contextmenu", function(e){
              e.preventDefault();
            }, false);
            document.addEventListener("keydown", function(e) {
            //document.onkeydown = function(e) {
              // "I" key
              if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
                disabledEvent(e);
              }
              // "J" key
              if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
                disabledEvent(e);
              }
              // "S" key + macOS
              if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                disabledEvent(e);
              }
              // "U" key
              if (e.ctrlKey && e.keyCode == 85) {
                disabledEvent(e);
              }
              // "F12" key
              if (e.keyCode == 123) {
                disabledEvent(e);
              }
            }, false);
            function disabledEvent(e){
              if (e.stopPropagation){
                e.stopPropagation();
              } else if (window.event){
                window.event.cancelBubble = true;
              }
              e.preventDefault();
              return false;
            }
        };

        // Create a new ClientJS object
        var client = new ClientJS();
        
        // Get the client's fingerprint id
        this.fingerprint = client.getFingerprint(); 

        /* this.token = localStorage.getItem('token');
        this.role  = localStorage.getItem('role');

        if(!this.token){
          this.token = sessionStorage.getItem('token');
        }

        if(!this.role){
          this.role = sessionStorage.getItem('role');
        } */

        this.authData = this.authenticationService.getCurrentAuthData();

        if(this.authData != null){
          this.role     = this.authData.role;
          this.token    = this.authData.token;
        }  

        //If token and role verifier is present then redirect verifier to certificate shared page
        if(this.token &&  this.role == 'ROLE_VERIFIER' )
        {
            this.hideVerifyBtn = false;
        }
        else
        {
            this.hideVerifyBtn = true;
        }


        this.getInstanceSetting();
    }

    async storeCertificateStats(certificateID){
      // Store 32bit hash id to the DB
      await this.certificateService.storeCertificateStats(certificateID,this.fingerprint).toPromise();
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

        this.getCertificateInfo(); 

      }, error => {
        this.alertService.showError(error.message);
      }) 
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

    getCertificateUrl(file) {
      let url = `/api/v1/common/file/${file}`;
      return url;
  }

    getCertificateInfo(){
        let certId = this.activatedRoute.snapshot.params.id;
        this.certificateService.getPublicCertificateInfo(certId).subscribe(success=>{
          this.certificateInfo = success['data']['certificateData'];
            this.instanceSettingData = success['data']['instanceSettingData'];

            this.certificateInfo.rawCertificate.issuedOn = moment(this.certificateInfo.rawCertificate.issuedOn).tz(this.instanceSettingObj.timeZone)
                                                                                                               .format(this.instanceSettingObj.dateFormat);

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


            // setTimeout(function(){
            //     $("#switchCertificate").selectpicker("refresh");
            // },1000);

            this.storeCertificateStats(this.certificateInfo._id);

            setTimeout(function () {
              $("select#loadedCertificate").selectpicker("refresh");
          }, 1000); 

        },error=>{
            this.alertService.showError(error.message);            
        })
    }

    //Verifier do the Verify With Instution process for certificate
    verifyWithInstitution(){

      //store certificate id to localstorage and sessionstorage
      localStorage.setItem('certificateID',this.certificateInfo._id);
      sessionStorage.setItem('certificateID',this.certificateInfo._id);

      //If token and role verifier is present then redirect verifier to certificate shared page
      if(this.token && this.role == 'ROLE_VERIFIER')
      {
        $("#openVerificationRequestModal").modal("show");
      }
      else
      {
          this.router.navigate([]).then(result => {  window.open('/', '_blank'); });
      }

    }

    async sendVerificationRequest(){
      if(this.requestMessage == "" || this.requestMessage == null){
        this.alertService.showError("Please enter verification request message");    
        return false;
      }

      let _promis = this.certificateService.sendVerificationRequest(this.certificateInfo._id,this.requestMessage).toPromise();

      _promis.then((response: any) => { 

          if (response.status == 'success') {
            this.alertService.showSuccess(response.message);
            $("#openVerificationRequestModal").modal("hide");
            this.requestMessage = "";
          }

        },error=>{
        this.alertService.showError(error.message); 
        $("#openVerificationRequestModal").modal("hide");           
      });
    }

    toTitleCase(str){
      let result = str.replace( /([A-Z])/g, " $1" );
      let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      return finalResult;
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