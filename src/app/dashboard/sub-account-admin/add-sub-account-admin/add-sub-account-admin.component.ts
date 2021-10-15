import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../user/user.service';
import { AlertService } from '../../../common/alert.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-add-sub-account-admin',
	templateUrl: './add-sub-account-admin.component.html',
	styleUrls: ['./add-sub-account-admin.component.css']
})
export class AddSubAccountAdminComponent implements OnInit {

	token: any;
	addSubAccountAdminForm: FormGroup;
	instanceSettingObj:any = {};

	constructor(private userService: UserService,
		private alertService: AlertService,
		public formBuilder: FormBuilder,
		private _router: Router,
		private ngxService:NgxUiLoaderService,
		private location:Location,
		private commonService: CommonService,
		private titleService: Title) {

		this.addSubAccountAdminForm = new FormGroup({
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
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Add Sub Account Admin");
  
		}, error => {
			this.alertService.showError(error.message);
		}) 
	} */

	clickBack(){
		this.location.back();
	}

	async addSubAccountAdmin() {
		if (this.addSubAccountAdminForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.addSubAccountAdminForm.value;

		frmValue['role'] = 'ROLE_SUB_ACCOUNT_ADMIN';

		try {
			//this.ngxService.start();
			let response = await this.userService.addSubAccountAdmin(frmValue).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				this._router.navigate(["/dashboard/sub-account-admin"]);
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
