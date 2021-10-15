import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../common/alert.service';
import { ProfileService } from './profile.service';
import { SharedService } from '../../common/shared.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../common/common.service';
import { AuthenticationService } from 'src/app/common/authentication.service';
import { Title } from '@angular/platform-browser';
declare var $:any;

@Component({
    selector:'app-dashboard-profile',
    templateUrl:'./profile.component.html',
    styleUrls:['./profile.component.css']
})
export class ProfileComponent implements OnInit{
   
    updateAccountSettingsForm: FormGroup;
    updatePasswordForm: FormGroup;
    profile:any = {};
    pattern = '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,64}$';
    role;
    instanceSettingObj:any = {};
    authData:any;
    userLocalStorageData:any = {};
    isEditable:any = {
		profileInfo:false
	}

    constructor(private alertService:AlertService,
                private profileService:ProfileService,
                private sharedService: SharedService,
                private ngxService:NgxUiLoaderService,
                private commonService: CommonService,
                private titleService: Title,
                private authenticationService:AuthenticationService){

        this.updateAccountSettingsForm = new FormGroup({
            firstName: new FormControl("", Validators.required),
            lastName: new FormControl("", Validators.required),
            email: new FormControl({value:"",disabled:false}, [Validators.required, Validators.email]),
            mobileNumber: new FormControl("", Validators.required),
            personalAddress: new FormControl("", Validators.required)
        });

        this.updatePasswordForm = new FormGroup({
            currentPassword: new FormControl("", Validators.required),
            newPassword: new FormControl("", [Validators.required, Validators.pattern(this.pattern)]),
            confirmPassword: new FormControl("", [Validators.required, Validators.pattern(this.pattern)])
        },{validators:this.passwordConfirming});
    }

    ngOnInit() {
        
        /* let role = localStorage.getItem('role');
        if (!role) {
            role = sessionStorage.getItem('role')
        }
        this.role = role; */

        let authData = this.authenticationService.getCurrentAuthData();
        this.role = authData['role'];

        this.getAccountSettingsData();

        /* this.getInstanceSetting(); */
        
    }

    enableEditMode(_section){
		try
		{
			this.isEditable[_section] = true
		}
		catch(e)
		{
			console.warn("Invalid Section");
		}
	}
    
    /* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Profile");

        }, error => {
            this.alertService.showError(error.message);
        }) 
    } */

    updateStorage(){

        this.authData = this.authenticationService.getCurrentAuthData();
        this.authData.firstName = this.userLocalStorageData.firstName;
        this.authData.lastName  = this.userLocalStorageData.lastName;

        this.authenticationService.setCurrentAuthData(this.authData);
        this.sharedService.change.next(true);
        
        /* if(localStorage.getItem('token')){
            localStorage.setItem('firstName',this.profile.firstName)
            localStorage.setItem('lastName',this.profile.lastName)
        }
        if(sessionStorage.getItem('token')){
            sessionStorage.setItem('firstName',this.profile.firstName)
            sessionStorage.setItem('lastName',this.profile.lastName)
        } */
    }

    getAccountSettingsData(){
        // //this.ngxService.start();
        try{
            let _promise = this.profileService.getAccountSettings().toPromise();
            _promise.then((response:any)=>{
                if(response.status == 'success'){
                    //this.ngxService.stop();
                    this.profile = response.data;
                    this.updateAccountSettingsForm.get('firstName').setValue(response.data.firstName);
                    this.updateAccountSettingsForm.get('lastName').setValue(response.data.lastName);
                    this.updateAccountSettingsForm.get('email').setValue(response.data.email);
                    this.updateAccountSettingsForm.get('mobileNumber').setValue(response.data.mobileNumber);
                    this.updateAccountSettingsForm.get('personalAddress').setValue(response.data.personalAddress);
                }
            }).catch(error=>{
                //this.ngxService.stop();
                this.alertService.showError(error.message);
            });
        }catch(e){
            //this.ngxService.stop();
            this.alertService.showError(e.message);
        }
    }

    async updateAccountSettings(){
        
        if(this.updateAccountSettingsForm.invalid){
            this.alertService.showError('Please check all fields');
			return false;
        }

        var frmValue = this.updateAccountSettingsForm.value;
        
        this.userLocalStorageData.firstName = frmValue.firstName;
        this.userLocalStorageData.lastName = frmValue.lastName;

        try {
            //this.ngxService.start();
			let response = await this.profileService.updateAccountSettings(frmValue).toPromise();
			if (response['status'] == 'success') {
                //this.ngxService.stop();
                this.alertService.showSuccess(response['message']);
                
                /* Switch Editable Mode */
				this.isEditable.profileInfo = false;


                // setTimeout(() => {
                    this.updateStorage();
                    window.location.reload();
                // }, 2000);

			} else {
                //this.ngxService.stop();
				this.alertService.showError(response['message']);
			}
		} catch (error) {
            //this.ngxService.stop();
			this.alertService.showError(error.message);
		}
    }

    async updatePassword(){
        if(this.updatePasswordForm.invalid){
            this.alertService.showError('Please check all fields');
			return false;
        }

        var frmValue = this.updatePasswordForm.value;

        if(frmValue['newPassword'] != frmValue['confirmPassword']){
            this.alertService.showError("New password and confirm password does not match");
            return false;
        }

        try {
            //this.ngxService.start();
			let response = await this.profileService.updatePassword(frmValue).toPromise();
			if (response['status'] == 'success') {
                //this.ngxService.stop();
                this.alertService.showSuccess(response['message']);	
                this.updatePasswordForm.reset();
			} else{
                //this.ngxService.stop();
				this.alertService.showError(response['message']);
			}
		} catch (error) {
            //this.ngxService.stop();
			this.alertService.showError(error.message);
		}
    }
    passwordConfirming(c: AbstractControl): { invalid: boolean } {
        if (c.get('newPassword').value !== c.get('confirmPassword').value) {
            return {invalid: true};
        }
    }
}

