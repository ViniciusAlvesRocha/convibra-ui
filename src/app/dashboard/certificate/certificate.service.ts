import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from 'src/app/common/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class CertificateService {
    constructor(private http: HttpClient,private authenticationService: AuthenticationService) {

    }

    getCertificates(pageNumber, limit,filter) {
        /* let role = localStorage.getItem('role');
        if(!role){
            role = sessionStorage.getItem('role')
        } */
        
        /* let authData = this.authenticationService.getCurrentAuthData();
        let role = authData['role']; */

        let url = '/api/v1/certificate/list';
        /* if(role=='ROLE_SUPER_ADMIN' || role=='ROLE_DELEGATE_ADMIN'){
            url = '/api/v1/certificates/all';
        } */
        return this.http.get(url, {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                filter: JSON.stringify(filter)
            }
        })
    }

    addRevokeCertificate(frmData){
        return this.http.post('/api/v1/certificate/revoke',frmData)
    }

    getCertificateBlob(url){
        return this.http.get(url,{
            responseType:"blob"
        });
    }

    issueCertificate(data){
        return this.http.post('/api/v1/certificate/issue',data);
    }

    /* claimCertificate(issuerAddress,fileId,privateKey){
        return this.http.put('/api/v1/contract/claim/certificate',{
            issuerAddress:issuerAddress,
            fileId:fileId,
            privateKey:privateKey
        })
    } */

    claimCertificate(certificateId){
        return this.http.post('/api/v1/certificate/claim/'+certificateId,{})
    }

    shareCertificate(emails,certificateId,issuerId){
        return this.http.post("/api/v1/certificate/share_to/verifier",{
            emails:emails,
            certificateId:certificateId,
            issuerId:issuerId
        })
    }

    getSharedCertificate(pageNumber, limit){
        return this.http.get("/api/v1/certificate/shared", {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    sendVerificationRequest(certificateId,requestMessage){
        return this.http.post("/api/v1/verification_request/send",{
            certificateId:certificateId,
            requestMessage:requestMessage
        })
    }

    getVerificationList(pageNumber, limit){
        return this.http.get("/api/v1/verification_request/list", {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    sendMessage(verificationRequestId,responseMessage){
        return this.http.post("/api/v1/verification_request/reply",{
            verificationRequestId:verificationRequestId,
            responseMessage:responseMessage
        })
    }

    getCertificateInfo(certificateId){
        return this.http.get("/api/v1/certificate/details/"+certificateId,{
            /* params:{
                certificateId:certificateId
            } */
        });
    }

    getPublicCertificateInfo(certificateId){
        return this.http.get("/api/v1/certificate/public/details/"+certificateId,{
            /* params:{
                certificateId:certificateId
            } */
        });
    }

    getRecipients(searchText){
        return this.http.get("/api/v1/users/recipient/search",{
            params:{
                searchText:searchText
            }
        })
    }

    getCertificateHistoryDetails(pageNumber,limit,issuedToId,courseName){
        return this.http.get("/api/v1/certificate/history",{
            params:{
                pageNumber:pageNumber,
                limit:limit,
                issuedToId:issuedToId,
                courseName:courseName
            }
        });
    }

    getCertificateId(qrResultData){
        return this.http.get("/api/v1/certificate/get_id_from_qr",{
            params:qrResultData
        });
    }


    getLoggedInUserInfo(){
        return this.http.get('/api/v1/users');
    }

    shareCertificateWithVerifier(certificateId){
        return this.http.post("/api/v1/share/certificate",{
            certificateId:certificateId
        })
    }


    storeCertificateStats(certificateId,fingerPrint){
        return this.http.post("/api/v1/certificate/store/stats",{
            certificateId:certificateId,
            fingerPrint:fingerPrint
        })
    }

    verifyPrivateKey(frmData){
        return this.http.post("/api/v1/user/verify_private_key",frmData);
    }

    getFile(_fileId){
        return this.http.get('/api/v1/common/file/'+_fileId);
    }

    getBatchListing(){
        return this.http.get('/api/v1/certificate/batch/list');
    }

    getRequestResponse(certificateID){
        return this.http.get('/api/v1/verification_request/list/'+certificateID);
    }
}