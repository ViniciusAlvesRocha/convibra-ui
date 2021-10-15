import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../signup/signup';
import { Login } from '../login/login';
import { Password } from '../reset-password/password';

@Injectable({
    'providedIn': 'root'
})
export class AuthenticationService {
    constructor(private http: HttpClient) {

    }

    signup(frmData){
        return this.http.post('/api/v1/auth/signup',frmData);
    }

    login(login:Login){
        return this.http.post('/api/v1/auth/login',login);
    }

    loginById(userID){
        return this.http.post('/api/v1/auth/loginByID/'+userID,{});
    }


    verifyEmail(token:string){
        return this.http.post(`/api/v1/auth/email/verification/${token}`,{});
    }

    resetPassword(password:Password){
        return this.http.post('/api/v1/auth/password/reset',password);
    }

    forgotPassword(email: string) {
        return this.http.post('/api/v1/auth/forgot_password', { email: email });
    }

    logout(){
        return this.http.delete('/api/v1/users');
    }

    getLoggedInUserInfo(){
        return this.http.get('/api/v1/users?verifyIssuer=true');
    }

    createAdminRecipient(password:Password){
        return this.http.put('/api/v1/users/admin/recipients',password);
    }

    getAllDomains(){
        return this.http.get('/api/v1/domains');
    }

    recipientCreation(frmData){
        return this.http.post('/api/v1/user/create/recipient',frmData)
    }

    getCurrentAuthData(){
        let _authData = localStorage.getItem('authData') ;
        if(!_authData){
            _authData = sessionStorage.getItem('authData');
        }

        let _finalAuthData = {}
        try
        {
            _finalAuthData = JSON.parse(_authData);
        }
        catch(e)
        {
            _finalAuthData = {};
        }
        
        return _finalAuthData;    
    }

    setCurrentAuthData(_authData){
        localStorage.setItem('authData',JSON.stringify(_authData)) ;
        sessionStorage.setItem('authData',JSON.stringify(_authData)) ;
        return _authData;
    }

    getCurrentAccessToken(){
        let _authData = this.getCurrentAuthData();
        
        if(_authData == null)
        {
            return false;
        }

        return _authData['token'];
    }

    
}
