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
	selector: 'app-edit-issuer',
	templateUrl: './edit-issuer.component.html',
	styleUrls: ['./edit-issuer.component.css']
})
export class EditIssuerComponent implements OnInit {

	updateIssuerForm: FormGroup;
	issuerDetails: any;
	activeIssuerId: any;
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

		this.updateIssuerForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl({value:"",disabled:false}, [Validators.required, Validators.email]),
			password: new FormControl(""),
			isAccountEnabled: new FormControl("")
		});
	}

	ngOnInit() {
		this.activeIssuerId = this.route.snapshot.paramMap.get("id");
		this.getUserDetails();
		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Edit Issuer");

        }, error => {
            this.alertService.showError(error.error.message);
        }) 
    } */

	clickBack(){
		this.location.back();
	}

	getUserDetails() {
		try {
			//this.ngxService.start();
			let _promise = this.userService.getUserDetails(this.activeIssuerId).toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
					//this.ngxService.stop();
					this.issuerDetails = response.data;

					this.updateIssuerForm.get('firstName').setValue(response.data.firstName);
					this.updateIssuerForm.get('lastName').setValue(response.data.lastName);
					this.updateIssuerForm.get('email').setValue(response.data.email);
					this.updateIssuerForm.get('isAccountEnabled').setValue(response.data.isAccountEnabled);

				}
			}).catch(error => {
				//this.ngxService.stop();
				this.alertService.showError(error.message);
			});
		} catch (error) {
			//this.ngxService.stop();
			this.alertService.showError(error.message);
		}
	}

	async updateIssuer() {
		if (this.updateIssuerForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.updateIssuerForm.value;

		frmValue['role'] = 'ROLE_ISSUER';

		try {
			//this.ngxService.start();
			let response = await this.userService.updateIssuer(frmValue, this.activeIssuerId).toPromise();

			if (response['status'] == 'success') {
				//this.ngxService.stop();
				this.alertService.showSuccess(response['message']);
				// this._router.navigate(["/dashboard/issuer"]);
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
