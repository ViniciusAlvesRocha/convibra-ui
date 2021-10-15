import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { AlertService } from '../../../common/alert.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-add-verifier',
	templateUrl: './add-verifier.component.html',
	styleUrls: ['./add-verifier.component.css']
})
export class AddVerifierComponent implements OnInit {

	addVerifierForm: FormGroup;
	instanceSettingObj:any = {};

	constructor(private userService: UserService,
		private alertService: AlertService,
		public formBuilder: FormBuilder,
		private _router: Router,
		private location:Location,
		private ngxService:NgxUiLoaderService,
		private commonService: CommonService,
		private titleService: Title) {

		this.addVerifierForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", Validators.required),
			isAccountEnabled: new FormControl("")
		});
	}
	ngOnInit() {
		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Add Verifier");
  
		}, error => {
			this.alertService.showError(error.message);
		}) 
	} */

	clickBack(){
		this.location.back();
	}

	async addVerifier() {
		if (this.addVerifierForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.addVerifierForm.value;

		frmValue['role'] = 'ROLE_VERIFIER';

		try {
			//this.ngxService.start();
			let response = await this.userService.addVerifier(frmValue).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				this._router.navigate(["/dashboard/verifier"]);
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
