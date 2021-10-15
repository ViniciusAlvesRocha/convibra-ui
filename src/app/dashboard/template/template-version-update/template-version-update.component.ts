import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { TemplateService } from '../template.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { Router, ActivatedRoute } from "@angular/router"

@Component({
	selector: 'app-template-version-update',
	templateUrl: './template-version-update.component.html',
	styleUrls: ['./template-version-update.component.css']
})
export class TemplateVersionUpdateComponent implements OnInit {

	templateVersionUpdateForm: FormGroup;
	docFileError = false;

	parentId: any;
	instanceSettingObj: any = {};
	parentTemplateDetail: any;

	@ViewChild('documentFile') documentFile: ElementRef;

	constructor(public formBuilder: FormBuilder,
		private alertService: AlertService,
		private templateService: TemplateService,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private titleService: Title) {

		this.templateVersionUpdateForm = formBuilder.group({
			startDate: ["", [Validators.required]],
			endDate: ["", [Validators.required]],
			documentFile: new FormControl("")
		});

	}

	ngOnInit() {
		this.parentId = this.route.snapshot.params['id'];
		this.getTemplateDetails();
		/* this.getInstanceSetting(); */
	}

	getTemplateDetails(){		
		this.templateService.getTemplateDetails(this.parentId).subscribe(success => {
			this.parentTemplateDetail = success['data'];
		}, error => {
			this.alertService.showError(error.message);
		})
	}

	/* getInstanceSetting() {
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName + ": Update Template Version");

		}, error => {
			this.alertService.showError(error.message);
		})
	} */

	updateTemplateVersion() {
		if (this.templateVersionUpdateForm.invalid) {
			this.alertService.showError("All fields require");
			return false;
		}

		if (this.documentFile == undefined) {
			this.alertService.showError("Please upload document file");
			return false;
		}

		if (this.docFileError == true) {
			this.alertService.showError("Please upload valid doc file");
			return false;
		}


		if (this.documentFile.nativeElement.files[0] == undefined) {
			this.alertService.showError("Please upload document file");
			return false;
		}


		let frmValue = this.templateVersionUpdateForm.value;

		frmValue.startDate = moment(frmValue.startDate).format("YYYY-MM-DD");
		frmValue.endDate = moment(frmValue.endDate).format("YYYY-MM-DD");

		let frmData = new FormData();
		frmData.append("parentID", this.parentId);
		frmData.append("startDate", frmValue.startDate);
		frmData.append("endDate", frmValue.endDate);
		frmData.append("document", this.documentFile.nativeElement.files[0]);

		try {
			var _promis = this.templateService.updateTemplateVersion(frmData).toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					this.alertService.showSuccess(response.message);
					this.router.navigate(['/dashboard/template/version-history/' + this.parentId]);
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

	updateFile(e) {
		if (this.documentFile.nativeElement.files[0].type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
			this.docFileError = true;
			this.alertService.showError("Please upload valid doc file");
			return false;
		}
		else {
			this.docFileError = false;
		}
	}

}
