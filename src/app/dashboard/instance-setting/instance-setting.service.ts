import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Profile } from './profile';

@Injectable({
    providedIn: 'root'
})
export class InstanceSetting {
    constructor(private http: HttpClient) {

    }
   
    getGeneralInfo(){
        return this.http.get("/api/v1/instance_setting/general_info");
    }

    updateGeneralInfo(frmData){
        return this.http.post("/api/v1/instance_setting/general_info/update",frmData);
    }

    getLocalizationInfo(){
        return this.http.get("/api/v1/instance_setting/localization");
    }

    updateLocalizationInfo(frmValue){
        return this.http.post("/api/v1/instance_setting/localization/update",frmValue);
    }

    getEmailSettingInfo(){
        return this.http.get("/api/v1/instance_setting/email_setting");
    }

    updateEmailSettingInfo(frmData){
        return this.http.post("/api/v1/instance_setting/email_setting/update",frmData)
    }

    getGoogleApiSettingInfo(){
        return this.http.get("/api/v1/instance_setting/google_api");
    }

    updateGoogleApiSettingInfo(frmData){
        return this.http.post("/api/v1/instance_setting/google_api/update",frmData)
    }
    
    getPaymetGetwaySettingInfo(){
        return this.http.get("/api/v1/instance_setting/payment_gateway");
    }

    updatePaymetGetwaySettingInfo(frmData){
        return this.http.post("/api/v1/instance_setting/payment_gateway/update",frmData)
    }

    getAPIFieldConfigInfo(){
        return this.http.get("api/v1/instance_setting/api_field");
    }

    updateAPIFieldConfigInfo(frmData){
        return this.http.post("api/v1/instance_setting/api_field/update",frmData)
    }

    getCertificateAccessInfo(){
        return this.http.get("/api/v1/instance_setting/certificate_access_trigger");
    }

    updateCertificateAccessInfo(frmData){
        return this.http.post("/api/v1/instance_setting/certificate_access_trigger/update",frmData)
    }

    getBlockchainInfo(){
        return this.http.get("/api/v1/instance_setting/blockchain_info");
    }

    updateCertificateStoreInfo(frmData){
        return this.http.post("/api/v1/instance_setting/certificate_store/update",frmData)
    }

    getWalletInfo(){
        return this.http.get("/api/v1/instance_setting/wallet");
    }

    updateWalletInfo(frmData){
        return this.http.post("/api/v1/instance_setting/wallet/update",frmData)
    }
}