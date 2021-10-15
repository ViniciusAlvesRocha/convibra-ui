import { Component, OnInit } from '@angular/core';
import { ApiConfigSettingService } from './api-config-setting.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from '../../common/alert.service';
import { CommonService } from '../../common/common.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
	selector: 'app-api-config-setting',
	templateUrl: './api-config-setting.component.html',
	styleUrls: ['./api-config-setting.component.css']
})
export class ApiConfigSettingComponent implements OnInit {

	updateAPIConfigSettingForm: FormGroup;
	apiConfigDetails: any;
	url = 'https?://.+';
	isEditable:any = {
		apiConfigInfo:false
	}

	constructor(private apiConfigSettingService: ApiConfigSettingService,
		private alertService: AlertService,
		private commonService: CommonService,
                private titleService: Title) {

		this.updateAPIConfigSettingForm = new FormGroup({
			apiUrl: new FormControl("", [Validators.required, Validators.pattern(this.url)]),
			scheduleType: new FormControl("", Validators.required),
			scheduleTime: new FormControl(""),
			headerValue: new FormControl(""),
			isEnabled: new FormControl("")
		});
	}

	ngOnInit() {
		this.getDetails();

		$('#scheduleTime').bootstrapMaterialDatePicker({
            date: false,
            shortTime: false,
            format: 'HH:mm'
		});
		
		setTimeout(() => {
			$('#scheduleType').selectpicker('refresh');
		}, 1000);

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

	
	
	
	getDetails() {
		try {
			let _promise = this.apiConfigSettingService.getAPIConfigSettingDetails().toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
					this.apiConfigDetails = response.data;

					// console.log(this.apiConfigDetails)

					this.updateAPIConfigSettingForm.get('apiUrl').setValue(response.data.apiUrl);
					this.updateAPIConfigSettingForm.get('scheduleType').setValue(response.data.scheduleType);
					this.updateAPIConfigSettingForm.get('scheduleTime').setValue(response.data.scheduleTime);
					this.updateAPIConfigSettingForm.get('headerValue').setValue(response.data.headerValue);
					this.updateAPIConfigSettingForm.get('isEnabled').setValue(response.data.isEnabled);
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			});
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

	async updateAPIConfigSetting() {
		if (this.updateAPIConfigSettingForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.updateAPIConfigSettingForm.value;
			frmValue['scheduleTime'] = $("#scheduleTime").val();

		try {
			let response = await this.apiConfigSettingService.updateAPIConfigSetting(frmValue).toPromise();
			if (response['status'] == 'success') {
				this.alertService.showSuccess(response['message']);

				 /* Switch Editable Mode */
				 this.isEditable.apiConfigInfo = false;
				
			} else {
				this.alertService.showError(response['message']);
			}
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

}
