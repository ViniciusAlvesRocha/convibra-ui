import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { AlertService } from '../../../common/alert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
	selector: 'app-manage-sub-account-admin',
	templateUrl: './manage-sub-account-admin.component.html',
	styleUrls: ['./manage-sub-account-admin.component.css']
})
export class ManageSubAccountAdminComponent implements OnInit {

	userList = [];
	totalItems = 0;
	start:any = 0;
    end:any = 0;
	currentPage = 1;
	perPage = 10;

	searchTerm:any;

	currentUserId:any;
	accountStatus:any;
	accountChangeStatus:any;
	accountUserName:any;
	instanceSettingObj:any = {};

	constructor(private userService: UserService,
		private alertService: AlertService,
		private ngxService:NgxUiLoaderService,
		private commonService: CommonService,
		private titleService: Title) {

			this.searchTerm = {
				firstName: "",
				lastName: "",
				email: ""
			}
		}

	ngOnInit() {
		this.getSubAccountAdminListing(this.currentPage, this.perPage, this.searchTerm);
		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Sub Account Admin - List");
  
		}, error => {
			this.alertService.showError(error.message);
		}) 
	} */

	getSubAccountAdminListing(pageNumber, limit, searchTerm) {
		// //this.ngxService.start();
		this.userService.getSubAccountAdminList(pageNumber, limit, searchTerm).subscribe(success => {
			//this.ngxService.stop();
			this.userList = success['data']['userData'];
			this.totalItems = success['data']['count'];
			this.start = (pageNumber - 1) * this.perPage + 1;
			this.end = (pageNumber - 1) * this.perPage + this.userList.length;
		}, error => {
			//this.ngxService.stop();
			this.userList = [];
			this.alertService.showError(error.message);
		})
	}

	parseEmailVerified(isEmailVerified) {
        if (isEmailVerified) {
            return "YES";
        } else {
            return "NO"
        }
	}
	
	parseAccountStatus(isAccountEnabled){
        if (isAccountEnabled) {
            return "ENABLED";
        } else {
            return "DISABLED"
        }
	}
	
	pageChange(page) {
        if (!isNaN(page)) {
            this.getSubAccountAdminListing(page, this.perPage, this.searchTerm);
        }
	}
	
	openChangeAccountStatus(user){
        this.currentUserId = user._id;
		this.accountStatus = "Enable";
		this.accountChangeStatus = true;
        if(user.isAccountEnabled){
			this.accountStatus = "Disable";
			this.accountChangeStatus = false;
        }
        this.accountUserName = user.firstName;
        $('#toggleAccount').modal('show');
	}
	
	toggleAccountStatus(userId, status){
		try{
			let _promise = this.userService.updateStatus(userId, status).toPromise();
			_promise.then((response:any)=>{
				if(response['status']=='success'){
					this.alertService.showSuccess(response['message']);
					this.getSubAccountAdminListing(this.currentPage, this.perPage, this.searchTerm);
					$('#toggleAccount').modal('hide');
				}
			}).catch(e=>{
				this.alertService.showError(e.error.message);
			})
		}catch(error){
			this.alertService.showError(error.message);
		}
	}
	
	filterRecords(){
		this.currentPage = 1;
		this.ngOnInit();
	}
}