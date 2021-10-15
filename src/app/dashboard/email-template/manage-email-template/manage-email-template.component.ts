import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../common/alert.service';
import { EmailTemplateService } from '../email-template.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-manage-email-template',
	templateUrl: './manage-email-template.component.html',
	styleUrls: ['./manage-email-template.component.css']
})
export class ManageEmailTemplateComponent implements OnInit {

	emailTemplateList = [];
	totalItems = 0;
	start:any = 0;
    end:any = 0;
	currentPage = 1;
	perPage = 10;
	instanceSettingObj:any = {};

	constructor(private emailTemplateService: EmailTemplateService,
				private alertService: AlertService,
				private commonService: CommonService,
                private titleService: Title) { }

	ngOnInit() {
		this.getListing(this.currentPage, this.perPage);

		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Email Template");

        }, error => {
            this.alertService.showError(error.error.message);
        }) 
    } */

	getListing(pageNumber, limit) {
		this.emailTemplateService.getListing(pageNumber, limit).subscribe(success => {
			this.emailTemplateList = success['data'];
			this.totalItems = this.emailTemplateList.length;
			this.start = (pageNumber - 1) * this.perPage + 1;
			this.end = (pageNumber - 1) * this.perPage + this.emailTemplateList.length;
		}, error => {
			this.alertService.showError(error.message);
		})
	}

	pageChange(page) {
		if (!isNaN(page)) {
			this.getListing(page, this.perPage);
		}
	}

}
