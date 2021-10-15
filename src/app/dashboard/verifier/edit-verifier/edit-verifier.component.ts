import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { AlertService } from '../../../common/alert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-edit-verifier',
	templateUrl: './edit-verifier.component.html',
	styleUrls: ['./edit-verifier.component.css']
})
export class EditVerifierComponent implements OnInit {

	updateVerifierForm: FormGroup;
	verifierDetails: any;
	activeVerifierId: any;
	instanceSettingObj:any = {};

	constructor(private userService: UserService,
		private alertService: AlertService,
		public formBuilder: FormBuilder,
		private _router: Router,
		private route: ActivatedRoute,
		private location:Location,
		private ngxService:NgxUiLoaderService,
		private commonService: CommonService,
		private titleService: Title) {

		this.updateVerifierForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl({value:"",disabled:false},[Validators.required, Validators.email]),
			password: new FormControl(""),
			isAccountEnabled: new FormControl("")
		});
	}

	ngOnInit() {
		this.activeVerifierId = this.route.snapshot.paramMap.get("id");
		this.getUserDetails();
		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Edit Verifier");
  
		}, error => {
			this.alertService.showError(error.message);
		}) 
	} */

	clickBack(){
		this.location.back();
	}

	getUserDetails() {
		try {
			//this.ngxService.start();
			let _promise = this.userService.getUserDetails(this.activeVerifierId).toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
					//this.ngxService.stop();
					this.verifierDetails = response.data;

					this.updateVerifierForm.get('firstName').setValue(response.data.firstName);
					this.updateVerifierForm.get('lastName').setValue(response.data.lastName);
					this.updateVerifierForm.get('email').setValue(response.data.email);
					this.updateVerifierForm.get('isAccountEnabled').setValue(response.data.isAccountEnabled);

				}
			}).catch(e => {
				//this.ngxService.stop();
				this.alertService.showError(e.error.message);
			});
		} catch (error) {
			//this.ngxService.stop();
			this.alertService.showError(error.message);
		}
	}

	async updateVerifier() {
		if (this.updateVerifierForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.updateVerifierForm.value;

		frmValue['role'] = 'ROLE_VERIFIER';
		frmValue['email'] = this.verifierDetails.email;

		try {
			//this.ngxService.start();
			let response = await this.userService.updateVerifier(frmValue, this.activeVerifierId).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				// this._router.navigate(["/dashboard/verifier"]);
			} else {
				//this.ngxService.stop();
				this.alertService.showError(response['message']);
			}
		} catch (error) {
			//this.ngxService.stop();
			this.alertService.showError(error.message);
		}
	}


}
