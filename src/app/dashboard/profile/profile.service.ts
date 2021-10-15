import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private http: HttpClient) {

    }
    
    getAccountSettings(){
        return this.http.get("/api/v1/auth/account_settings");
    }

    updateAccountSettings(frmData){
        return this.http.post("/api/v1/auth/account_settings/update",frmData);
    }

    updatePassword(frmData){
        return this.http.post("/api/v1/auth/password/update",frmData);
    }

}