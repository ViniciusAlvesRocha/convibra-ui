import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../common/alert.service';
import { EmailTemplateService } from '../email-template.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

import { AngularEditorConfig } from '@kolkov/angular-editor';

declare var $: any;

@Component({
	selector: 'app-add-email-template',
	templateUrl: './add-email-template.component.html',
	styleUrls: ['./add-email-template.component.css']
})
export class AddEmailTemplateComponent implements OnInit {

	addEmailTemplateForm: FormGroup;
	public templateVariableFields: any[] = [{
		templateVariables: ''
	  }];
	instanceSettingObj:any = {};
	  
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
		private location: Location,
		private commonService: CommonService,
		private titleService: Title) {

		this.addEmailTemplateForm = new FormGroup({
			templateName: new FormControl("", Validators.required),
			templateSubject: new FormControl("", Validators.required),
			templateFrom: new FormControl("", Validators.required),
			templateFromEmail: new FormControl("", [Validators.required, Validators.email]),
			templateHtml: new FormControl("", Validators.required),
			templateVariables: new FormControl("", Validators.required)
		});
	}

	ngOnInit() {
		// this.getInstanceSetting();
	}

	/* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Add Email Template");

        }, error => {
            this.alertService.showError(error.message);
        }) 
    } */

	addTemplateVariable(){
		this.templateVariableFields.push({
			templateVariables: ''
		});
	}

	removeTemplateVariables(i: number){
		this.templateVariableFields.splice(i,1);
	}
	
	syncField(_index, _field, evt) {
		this.templateVariableFields[_index][_field] = evt.target.value
	}

	clickBack() {
		this.location.back();
	}

	async addEmailTemplate() {
		if (this.addEmailTemplateForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}

		var frmValue = this.addEmailTemplateForm.value;

		if(frmValue.templateHtml == null || frmValue.templateHtml == "")
		{
			this.alertService.showWarning("Template Html is required");
			return false;
		}

		frmValue['templateVariables'] = this.templateVariableFields.map(x=>x.templateVariables).join("~");
		
		try {
			let response = await this.emailTemplateService.storeEmailTemplate(frmValue).toPromise();
			if (response['status'] == 'success') {
				this.alertService.showSuccess(response['message']);
				this._router.navigate(["/dashboard/email-template"]);
			} else {
				this.alertService.showError(response['message']);
			}
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

}
