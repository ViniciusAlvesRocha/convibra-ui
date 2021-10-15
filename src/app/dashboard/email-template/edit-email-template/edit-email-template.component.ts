import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../common/alert.service';
import { EmailTemplateService } from '../email-template.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
	selector: 'app-edit-email-template',
	templateUrl: './edit-email-template.component.html',
	styleUrls: ['./edit-email-template.component.css']
})
export class EditEmailTemplateComponent implements OnInit {

	updateEmailTemplateForm: FormGroup;
	emailTemplateDetails: any;
	activeEmailTemplateId: any;
	arrTemplateVariables: any = [];
	instanceSettingObj:any = {};
	isOnlyView: boolean = false;

	public templateVariableFields: any[] = [{
		templateVariables: ''
	}];

	editorConfig: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: '15rem',
		minHeight: '5rem',
		placeholder: 'Enter text here...',
		translate: 'no',
		defaultParagraphSeparator: 'p',
		defaultFontName: 'Arial',
		sanitize: false,
		// toolbarHiddenButtons: [
		//   /* ['bold'] */
		//   ],
		customClasses: [
		  {
			name: "quote",
			class: "quote",
		  },
		  {
			name: 'redText',
			class: 'redText'
		  },
		  {
			name: "titleText",
			class: "titleText",
			tag: "h1",
		  },
		]
	};

	constructor(private emailTemplateService: EmailTemplateService,
		private alertService: AlertService,
		public formBuilder: FormBuilder,
		private _router: Router,
		private route: ActivatedRoute,
		private location:Location,
		private commonService: CommonService,
		private titleService: Title) {

		this.updateEmailTemplateForm = new FormGroup({
			templateName: new FormControl("", Validators.required),
			templateSubject: new FormControl("", Validators.required),
			templateFrom: new FormControl("", Validators.required),
			templateFromEmail: new FormControl("", Validators.required),
			templateHtml: new FormControl("", Validators.required),
			templateVariables:new FormControl(""),
		});
	}

	ngOnInit() {
		this.activeEmailTemplateId = this.route.snapshot.paramMap.get("id");
		this.getDetails();
		// this.getInstanceSetting();
	}

	/* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Edit Email Template");

        }, error => {
            this.alertService.showError(error.error.message);
        }) 
    } */

	clickBack(){
		this.location.back();
	}

	getDetails() {
		try {
			let _promise = this.emailTemplateService.getDetails(this.activeEmailTemplateId,this.isOnlyView).toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
					this.emailTemplateDetails = response.data;

					this.updateEmailTemplateForm.get('templateName').setValue(response.data.templateName);
					this.updateEmailTemplateForm.get('templateSubject').setValue(response.data.templateSubject);
					this.updateEmailTemplateForm.get('templateFrom').setValue(response.data.templateFrom);
					this.updateEmailTemplateForm.get('templateFromEmail').setValue(response.data.templateFromEmail);
					this.updateEmailTemplateForm.get('templateHtml').setValue(response.data.templateHtml);

					this.arrTemplateVariables = response.data.templateVariables.split("~");

					if(this.arrTemplateVariables.length > 0){
						let tmpArr = []; 
						this.arrTemplateVariables.forEach((templateVariables)=>{
							let tmpObj = {};
							tmpObj['templateVariables'] = templateVariables;

							tmpArr.push(tmpObj);
						});
						this.templateVariableFields = tmpArr;
					}
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			});
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

	syncField(_index, _field, evt) {
		this.templateVariableFields[_index][_field] = evt.target.value
	}

	async updateEmailTemplate() {
		if (this.updateEmailTemplateForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmData = this.updateEmailTemplateForm.value;

		if(frmData.templateHtml == null || frmData.templateHtml == "") {
			this.alertService.showWarning("Template Html is required");
			return false;
		}

		let frmValue = {};
		// frmValue['templateName'] = frmData.templateName;
		frmValue['templateSubject'] = frmData.templateSubject;
		frmValue['templateFrom'] = frmData.templateFrom;
		frmValue['templateFromEmail'] = frmData.templateFromEmail;
		frmValue['templateHtml'] = frmData.templateHtml;
		// frmValue['templateVariables'] = this.templateVariableFields.map(x=>x.templateVariables).join("~");
		
		try {
			let response = await this.emailTemplateService.updateEmailTemplate(frmValue, this.activeEmailTemplateId).toPromise();

			if (response['status'] == 'success') {
				this.alertService.showSuccess(response['message']);
			} else {
				this.alertService.showError(response['message']);
			}
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

}
