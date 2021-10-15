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
	selector: 'app-edit-sub-account-admin',
	templateUrl: './edit-sub-account-admin.component.html',
	styleUrls: ['./edit-sub-account-admin.component.css']
})
export class EditSubAccountAdminComponent implements OnInit {

	updateSubAccountAdminForm: FormGroup;
	subAccountAdminDetails: any;
	activeSubAccountAdminId: any;
	instanceSettingObj:any = {};

	constructor(private userService: UserService,
		private alertService: AlertService,
		public formBuilder: FormBuilder,
		private _router: Router,
		private route: ActivatedRoute,
		private ngxService:NgxUiLoaderService,
		private location:Location,
		private commonService: CommonService,
		private titleService: Title) {

		this.updateSubAccountAdminForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl({value:"",disabled:false}, [Validators.required, Validators.email]),
			password: new FormControl(""),
			isAccountEnabled: new FormControl("")
		});
	}

	ngOnInit() {
		this.activeSubAccountAdminId = this.route.snapshot.paramMap.get("id");
		this.getUserDetails();
		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Edit Sub Account Admin");
  
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
			let _promise = this.userService.getUserDetails(this.activeSubAccountAdminId).toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
					//this.ngxService.stop();
					this.subAccountAdminDetails = response.data;

					this.updateSubAccountAdminForm.get('firstName').setValue(response.data.firstName);
					this.updateSubAccountAdminForm.get('lastName').setValue(response.data.lastName);
					this.updateSubAccountAdminForm.get('email').setValue(response.data.email);
					this.updateSubAccountAdminForm.get('isAccountEnabled').setValue(response.data.isAccountEnabled);

				}
			}).catch(e => {
				//this.ngxService.stop();
				this.alertService.showError(e.message);
			});
		} catch (error) {
			//this.ngxService.stop();
			this.alertService.showError(error.message);
		}
	}

	async updateSubAccountAdmin() {
		if (this.updateSubAccountAdminForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.updateSubAccountAdminForm.value;

		frmValue['role'] = 'ROLE_SUB_ACCOUNT_ADMIN';

		try {
			//this.ngxService.start();
			let response = await this.userService.updateSubAccountAdmin(frmValue, this.activeSubAccountAdminId).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				// this._router.navigate(["/dashboard/sub-account-admin"]);
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
