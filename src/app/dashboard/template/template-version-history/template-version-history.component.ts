import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../template.service';
import { AlertService } from '../../../common/alert.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/common/authentication.service';

declare var $: any;

@Component({
    selector: 'app-template-version-history',
    templateUrl: './template-version-history.component.html',
    styleUrls: ['./template-version-history.component.css']
})
export class TemplateVersionHistoryComponent implements OnInit {
    templateList: any[];
    totalItems = 0;
    start;
    end;
    currentPage = 0;
    parentId = 0;
    templateId: any;
    instanceSettingObj: any = {};

    accountID: any;
    currentUserRole: any;
    parentTemplateDetail: any = {};

    constructor(private templateService: TemplateService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private titleService: Title) { }

    ngOnInit() {
        this.templateList = [];

        // this.accountID = localStorage.getItem('accountID');
        // this.currentUserRole = localStorage.getItem('role');

        this.accountID = false;

        let authData = this.authenticationService.getCurrentAuthData();
        this.currentUserRole = authData['role'];


        /* if(!this.accountID){
            this.accountID = sessionStorage.getItem('accountID');
            if(!this.accountID){
                this.accountID = false;
            }
        } */

        /* if(!this.currentUserRole){
            this.currentUserRole = sessionStorage.getItem('role');
        } */

        this.parentId = this.route.snapshot.params['id'];

        this.getTemplates({ "parentID": this.parentId });
        /* this.getInstanceSetting(); */
        this.getVersionHistoryDetail();
    }

    getVersionHistoryDetail() {
        this.templateService.getVersionHistoryDetail(this.parentId).subscribe(success => {
            this.parentTemplateDetail = success['data']['parent'];
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    /* getInstanceSetting() {
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName + ": Template Version History");

        }, error => {
            this.alertService.showError(error.error.message);
        })
    } */

    getTemplates(filter) {
        this.templateService.getTemplates(filter).subscribe(success => {
            this.templateList = success['data'];
            this.totalItems = success['data'].length;
            this.start = 0;
            this.end = this.templateList.length;
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    openDeleteTemplateModal(templateId) {
        $('#openDeleteTemplateModal').modal('show');

        this.templateId = templateId;
    }

    deleteTemplate() {
        this.templateService.deleteTemplate(this.templateId).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getTemplates({ "parentID": this.parentId });
            $('#openDeleteTemplateModal').modal('hide');
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    viewTemplate(id) {

        if (id == null) {
            this.alertService.showError("Preview file not available");
        } else {
            window.open(`/api/v1/common/file/${id}`, '_blank');
        }
    }
}
