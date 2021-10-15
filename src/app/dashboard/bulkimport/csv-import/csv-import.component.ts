import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BulkImportService } from '../bulkimport.service';
import { AlertService } from 'src/app/common/alert.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-csv-import',
    templateUrl: './csv-import.component.html',
    styleUrls: ['./csv-import.component.css']
})
export class CSVImportComponent implements OnInit {
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
    filter: any;

    @ViewChild("csvUploadForm") csvUploadForm;
    @ViewChild("fileInput") fileInput: ElementRef;

    constructor(public BulkImportService: BulkImportService,
        private alertService: AlertService,
        private commonService: CommonService,
        private titleService: Title) {
        this.filter = {
            recipientImportType: 'ALL'
        }
    }

    ngOnInit() {

        this.currentPage = 0;
        this.initializeDropify();

        // this.autoRefresh = false;
        // this.toggleAutoRefresh();
    }


    ngOnDestroy() {
        clearInterval(this.autoRefreshInterval);
    }

    getAllListing(pageNumber, limit) {
        this.BulkImportService.getList(pageNumber, limit, this.filter).subscribe(success => {
            this.queueList = success['data']['data'];
            this.totalItems = success['data']['count'];
            this.start = (pageNumber - 1) * this.perPage + 1;
            this.end = (pageNumber - 1) * this.perPage + this.queueList.length;
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    toggleAutoRefresh() {
        if (this.autoRefresh == true) {
            this.autoRefresh = false;
            clearInterval(this.autoRefreshInterval);
        }
        else {
            this.autoRefresh = true;
            this.autoRefreshInterval = setInterval(() => {
                this.getAllListing(this.currentPage, this.perPage);
            }, 5000);
        }
    }

    setCurrentQueue(_currentQueue) {
        this.currentQueue = _currentQueue;
        $('#queueLogModal').modal('show');
    }

    prettyJSON(_json) {
        return JSON.stringify(_json, null, '  ')
    }

    pageChange(page) {
        if (!isNaN(page)) {
            this.getAllListing(page, this.perPage);
        }
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

    openBulkRecipientModal() {
        this.dropify.data('dropify').resetPreview();
        $('#bulkRecipientModal').modal('show');
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    uploadCsvFile() {
        if (this.csvUploadForm.invalid) return;
        var fd = new FormData();
        if (this.fileToUpload.name && this.fileToUpload.name.split('.').pop().toLowerCase() == 'csv') {
            fd.append('csvFile', this.fileToUpload);
            fd.append('tag', this.tag);
            this.BulkImportService.uploadRecipientInBulk(fd).subscribe(success => {
                this.alertService.showSuccess(success['message']);
                this.getAllListing(this.currentPage, this.perPage);
                $('#bulkRecipientModal').modal('hide');
                this.csvUploadForm.resetForm();
            }, error => {
                this.alertService.showError(error.message);
            })
        } else {
            this.alertService.showError("Please uplaod csv file");
        }
    }

}
