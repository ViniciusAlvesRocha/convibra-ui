import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    'providedIn':'root'
})
export class BlockchainInfoService{
    constructor(private http:HttpClient){

    }

    getWalletInfo(){
        return this.http.get("/api/v1/user/wallet_details");
    }

    getPrivateKey(){
        return this.http.get("/api/v1/users/priv/key");
    }
}