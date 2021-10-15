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
	selector: 'app-edit-recipient',
	templateUrl: './edit-recipient.component.html',
	styleUrls: ['./edit-recipient.component.css']
})
export class EditRecipientComponent implements OnInit {

	updateRecipientForm: FormGroup;
	recipientDetails: any;
	activeRecipientId: any;
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

		this.updateRecipientForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl({value:"",disabled:false}, [Validators.required, Validators.email]),
			password: new FormControl(""),
			isAccountEnabled: new FormControl("")
		});
	}

	ngOnInit() {
		this.activeRecipientId = this.route.snapshot.paramMap.get("id");
		this.getUserDetails();
		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Edit Recipient");
  
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
			let _promise = this.userService.getUserDetails(this.activeRecipientId).toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
					//this.ngxService.stop();
					this.recipientDetails = response.data;

					this.updateRecipientForm.get('firstName').setValue(response.data.firstName);
					this.updateRecipientForm.get('lastName').setValue(response.data.lastName);
					this.updateRecipientForm.get('email').setValue(response.data.email);
					this.updateRecipientForm.get('isAccountEnabled').setValue(response.data.isAccountEnabled);

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

	async updateRecipient() {
		if (this.updateRecipientForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.updateRecipientForm.value;

		frmValue['role'] = 'ROLE_RECIPIENT';
		frmValue['email'] = this.recipientDetails.email;

		try {
			//this.ngxService.start();
			let response = await this.userService.updateRecipient(frmValue, this.activeRecipientId).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				// this._router.navigate(["/dashboard/recipient"]);
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
