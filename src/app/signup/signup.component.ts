import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../common/authentication.service';
import { CommonService } from '../common/common.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertService } from '../common/alert.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
declare var $: any;

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	signupUserForm: FormGroup;
	pattern = '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,64}$';
	instanceSettingObj:any = {};

	constructor(private authenticationService: AuthenticationService,
				private router: Router,
				private alertService: AlertService,
				private commonService: CommonService,
				private titleService: Title) {

			this.signupUserForm = new FormGroup({
				firstName: new FormControl("", Validators.required),
				lastName: new FormControl("", Validators.required),
				email: new FormControl("", [Validators.required, Validators.email]),
				password: new FormControl("", [Validators.required, Validators.pattern(this.pattern)]),
				confirmPassword: new FormControl("", [Validators.required, Validators.pattern(this.pattern)]),
				mobileNumber: new FormControl("", Validators.required),
				personalAddress: new FormControl("", Validators.required),
				role: new FormControl("", Validators.required),
				checked: new FormControl("", Validators.required)
			});
	}
		
	ngOnInit() {
		this.getInstanceSetting();
	}

	getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
		  
			this.instanceSettingObj.logo = '/api/v1/common/file/'+success['data'].general.logo;
			this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Sign Up");
		}, error => {
		  this.alertService.showError(error.message);
		}) 
	  }

	async signupUser() {
		if (this.signupUserForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		this.signupUserForm.removeControl('checked');

		var frmValue = this.signupUserForm.value;

		try {
			let response = await this.authenticationService.signup(frmValue).toPromise();

			if (response['status'] == 'success') {
				this.alertService.showSuccess(response['message']);
				this.signupUserForm.reset();
			} else {
				this.alertService.showError(response['message']);
			}
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}
}
