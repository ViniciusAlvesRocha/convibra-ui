import { Component, OnInit } from '@angular/core';
import { BulkImportService } from '../bulkimport.service';
import { AlertService } from 'src/app/common/alert.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-api-import',
  templateUrl: './api-import.component.html',
  styleUrls: ['./api-import.component.css']
})
export class APIImportComponent implements OnInit {
  
  queueList = [];
  totalItems = 0;
  start;
  end;
  dropify: any;
  csvFile;
  fileToUpload: File;
  tag:any;
  currentPage: any;
  currentQueue:any;
  autoRefresh:boolean;
  autoRefreshInterval:any;
  perPage = 20;

  constructor(public BulkImportService:BulkImportService,
              private alertService: AlertService,
              private commonService: CommonService,
              private titleService: Title) { }


  ngOnInit() {
    this.currentPage = 0;
  
    this.autoRefresh = false;
    this.toggleAutoRefresh();
  }



  ngOnDestroy(){
    clearInterval(this.autoRefreshInterval);
  }

  toggleAutoRefresh(){
    if(this.autoRefresh == true)
    {
        this.autoRefresh = false;
        clearInterval(this.autoRefreshInterval);
    }
    else
    {
        this.autoRefresh = true;    
        this.autoRefreshInterval = setInterval(() => {
            this.getAllListing(this.currentPage, this.perPage);    
        },5000);
    }
  }

  getAllListing(pageNumber, limit) {
    this.BulkImportService.getAPIImportQueueList(pageNumber, limit).subscribe(success => {
        this.queueList = success['data']['data'];
        this.totalItems = success['data']['count'];
        this.start = (pageNumber - 1) * this.perPage + 1;
        this.end = (pageNumber - 1) * this.perPage + this.queueList.length;
    }, error => {
        this.alertService.showError(error.message);
    })
  }

  pageChange(page) {
    if (!isNaN(page)) {
        this.getAllListing(page, this.perPage);
    }
  }

  prettyJSON(_json){
    return JSON.stringify(_json, null, '  ')
  }

  setCurrentQueue(_currentQueue){
    this.currentQueue = _currentQueue;
    $('#queueLogModal').modal('show');
  }
}
