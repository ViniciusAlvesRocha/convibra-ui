import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { AlertService } from '../../../common/alert.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-add-recipient',
	templateUrl: './add-recipient.component.html',
	styleUrls: ['./add-recipient.component.css']
})
export class AddRecipientComponent implements OnInit {

	addRecipientForm: FormGroup;
	instanceSettingObj:any = {};

	constructor(private userService: UserService,
		private alertService: AlertService,
		public formBuilder: FormBuilder,
		private _router: Router,
		private location:Location,
		private ngxService:NgxUiLoaderService,
		private commonService: CommonService,
		private titleService: Title) {

		this.addRecipientForm = new FormGroup({
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
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Add Recipient");
  
		}, error => {
			this.alertService.showError(error.message);
		}) 
	} */

	clickBack(){
		this.location.back();
	}

	async addRecipient() {
		if (this.addRecipientForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.addRecipientForm.value;

		frmValue['role'] = 'ROLE_RECIPIENT';

		try {
			//this.ngxService.start();
			let response = await this.userService.addRecipient(frmValue).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				this._router.navigate(["/dashboard/recipient"]);
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
