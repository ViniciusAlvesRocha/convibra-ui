import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { SuperUser } from './super-user';
import { Issuer } from './issuer';
import { SubAdmin } from './sub-admin';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {

    }

    getUserList(pageNumber, limit) {
        return this.http.get('/api/v1/users/list', {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    addSuperUser(superUser: SuperUser) {
        return this.http.post('/api/v1/users/add/super/user', superUser);
    }
    
    /* addIssuer(issuer: Issuer) {
        return this.http.post('/api/v1/users/add/issuer', issuer);
    } */
    
    addSubAdmin(subAdmin: SubAdmin) {
        return this.http.post('api/v1/users/add/sub/admin', subAdmin);
    }

    updateSubAdmin(subAdmin: SubAdmin,id) {        
        return this.http.put('api/v1/users/update/sub/admin/'+id, subAdmin);        
    }

    approveIssuer(userId){
        return this.http.put('/api/v1/contract/approve/issuer',{},{
            params:{
                userId:userId
            }
        })
    }

    toggleAccountStatus(userId){
        return this.http.put('/api/v1/users/account/status',{},{
            params:{
                userId:userId
            }
        })
    }

    uploadRecipientInBulk(fd:FormData){
        return this.http.post('/api/v1/users/recipient/bulk',fd);
    }

    recipientsList(searchTxt){
        return this.http.get('/api/v1/users/recipients', {
            params: {
                searchTxt: searchTxt,          
            }
        })
    }

    searchRecipients(keyword){
        return this.http.get('/api/v1/users/search',{
            params:{
                keyword:keyword
            }
        })                  
    }

    updateAPIConfig(apiUrl,scheduleType,scheduleTime,headerValue,isEnabled){
        return this.http.post('/api/v1/updateAPIConfig', {
                apiUrl: apiUrl,
                scheduleType: scheduleType,
                scheduleTime:scheduleTime,
                headerValue:headerValue,
                isEnabled:isEnabled
        });
    }

    getAPIConfig() {
        return this.http.get('/api/v1/getAPIConfig');
    }

    getSubAdminList(pageNumber, limit) {
        return this.http.get('/api/v1/users/list', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                type:'ROLE_SUB_ADMIN'
            }
        })
    }


    getSubAccountAdminList(pageNumber, limit, searchTerm) {
        return this.http.get('/api/v1/user/listing', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                role:'ROLE_SUB_ACCOUNT_ADMIN',
                searchTerm: (JSON.stringify(searchTerm))
            }
        })
    }

    addSubAccountAdmin(frmData){
        return this.http.post('/api/v1/user/create', frmData);
    }


    getUserDetails(userId){
        return this.http.get('/api/v1/user/details/'+ userId)
    }

    updateSubAccountAdmin(frmData, id){
        return this.http.post('/api/v1/user/update/'+id, frmData);      
    }

    getIssuerList(pageNumber, limit, searchTerm) {
        return this.http.get('/api/v1/user/listing', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                role:'ROLE_ISSUER',
                searchTerm: (JSON.stringify(searchTerm))
            }
        })
    }

    addIssuer(frmData){
        return this.http.post('/api/v1/user/create', frmData);
    }

    updateIssuer(frmData, id){
        return this.http.post('/api/v1/user/update/'+id, frmData);
    }

    getVerifierList(pageNumber, limit, searchTerm) {
        return this.http.get('/api/v1/user/listing', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                role:'ROLE_VERIFIER',
                searchTerm: (JSON.stringify(searchTerm))
            }
        })
    }

    addVerifier(frmData){
        return this.http.post('/api/v1/user/create', frmData);
    }

    updateVerifier(frmData, id){
        return this.http.post('/api/v1/user/update/'+id, frmData);
    }

    getRecipientList(pageNumber, limit, searchTerm) {
        return this.http.get('/api/v1/user/listing', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                role:'ROLE_RECIPIENT',
                searchTerm: (JSON.stringify(searchTerm))
            }
        })
    }

    addRecipient(frmData){
        return this.http.post('/api/v1/user/create', frmData);
    }

    updateRecipient(frmData, id){
        return this.http.post('/api/v1/user/update/'+id, frmData);
    }
    
    updateStatus(id, status){
        return this.http.post('/api/v1/user/update/status/'+id+'/'+status,{});
    }
}   