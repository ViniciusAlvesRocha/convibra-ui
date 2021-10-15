import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BulkImportService } from '../bulkimport.service';
import { AlertService } from 'src/app/common/alert.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

declare var $: any;

@Component({
	selector: 'app-add-csv-import',
	templateUrl: './add-csv-import.component.html',
	styleUrls: ['./add-csv-import.component.css']
})
export class AddCsvImportComponent implements OnInit {

	queueList = [];
	totalItems = 0;
	start;
	end;
	dropify: any;
	csvFile;
	fileToUpload: File;
	tag: any;
	currentPage: any;
	currentQueue: any;
	autoRefresh: boolean;
	autoRefreshInterval: any;
	perPage = 7;
	apiFieldsConfig:any = [];


	@ViewChild("csvUploadForm") csvUploadForm;
	@ViewChild("fileInput") fileInput: ElementRef;

	constructor(public BulkImportService: BulkImportService, 
				private alertService: AlertService,
				private commonService: CommonService,
				private titleService: Title,
				private router: Router) { }

	ngOnInit() {
		// this.dropify.data('dropify').resetPreview();
		this.getApiFieldConfigInfo();
	}

	
	
	getApiFieldConfigInfo(){
		try{

			let _promise = this.BulkImportService.getApiFieldConfigInfo().toPromise();

			_promise.then((response:any)=>{
				if (response.status == 'success') {
					this.apiFieldsConfig = response.data.apiFieldConfig.fields;
				}
			}).catch(error=>{
				this.alertService.showError(error.message);
			});
		}catch(error){
			this.alertService.showError(error.message);
		}
	}

	handleFileInput(files: FileList) {
		this.fileToUpload = files.item(0);
	}

	openBulkRecipientModal() {
		this.dropify.data('dropify').resetPreview();
		$('#bulkRecipientModal').modal('show');
	}

	initializeDropify() {
		var self = this;
		$(function () {
			var drEvent = $('.dropify').dropify();
			self.dropify = drEvent;
			drEvent.on('dropify.beforeClear', function (event, element) {
				self.csvUploadForm.controls['template'].reset();
				return true;
			});
		});
	}

	uploadCsvFile() {
		if (this.csvUploadForm.invalid) return;
		var fd = new FormData();
		if (this.fileToUpload.name && this.fileToUpload.name.split('.').pop().toLowerCase() == 'csv') {
			fd.append('csvFile', this.fileToUpload);
			fd.append('tag', this.tag);
			this.BulkImportService.uploadRecipientInBulk(fd).subscribe(success => {
				this.alertService.showSuccess(success['message']);
				this.csvUploadForm.resetForm();
				this.router.navigate(['/dashboard/bulkimport/recipient']);
			}, error => {
				this.alertService.showError(error.message);
			})
		} else {
			this.alertService.showError("Please upload csv file");
		}
	}

}
