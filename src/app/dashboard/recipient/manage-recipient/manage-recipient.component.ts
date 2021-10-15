import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { AlertService } from '../../../common/alert.service';
import { CourseService } from '../../course/course.service';
import { CommonService } from '../../../common/common.service';
import { AuthenticationService } from '../../../common/authentication.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
	selector: 'app-manage-recipient',
	templateUrl: './manage-recipient.component.html',
	styleUrls: ['./manage-recipient.component.css']
})
export class ManageRecipientComponent implements OnInit {

	userList = [];
	totalItems = 0;
	start:any = 0;
    end:any = 0;
	currentPage = 1;
	perPage = 10;

	searchTerm:any;

	currentUserRole:any;
	currentUserId:any;
	accountStatus:any;
	accountChangeStatus:any;
	accountUserName:any;

	coursesList: any = [];
	courseDropDownList = [];
	instanceSettingObj:any = {};
	authData:any;

	constructor(private userService: UserService,
		private alertService: AlertService,
		private courseService: CourseService,
		private commonService: CommonService,
		private titleService: Title,
		private authenticationService:AuthenticationService) { 
			this.searchTerm = {
				firstName: "",
				lastName: "",
				email: ""
			}
		}

	ngOnInit() {
		this.getRecipientListing(this.currentPage, this.perPage, this.searchTerm);

		/* Get Current User Role */
		this.authData        = this.authenticationService.getCurrentAuthData();
		this.currentUserRole = this.authData.role;

		if(this.currentUserRole == 'ROLE_SUB_ACCOUNT_ADMIN'){
			this.getCourseListing();

			setTimeout(() => {
				$('#courses').selectpicker('refresh');
			}, 1000);
		}

		/* this.getInstanceSetting(); */
	}

	/* getInstanceSetting(){
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName+": Recipient List");
  
		}, error => {
			this.alertService.showError(error.message);
		}) 
	} */

	getCourseListing(){
		try{
			let tmpCourse = this.courseService.getCourseList(0, 0).toPromise()
			tmpCourse.then((response:any)=>{
				if(response.status == 'success'){
					this.coursesList = response['data'];

					if (this.coursesList.length > 0) {
						let tmpArr = [];
						this.coursesList.forEach((course) => {
							let tmpObj = {};
							tmpObj['_id'] = course._id;
							tmpObj['item_text'] = course.nameLang1;
		
							tmpArr.push(tmpObj);
						});
		
						this.courseDropDownList = tmpArr;
					}
				}
			}).catch(error=>{
				this.alertService.showError(error.message);
			});
		}catch(error){
			this.alertService.showError(error.message);
		}	
	}

	getRecipientListing(pageNumber, limit, searchTerm) {
		this.userService.getRecipientList(pageNumber, limit, searchTerm).subscribe(success => {
			this.userList = success['data']['userData'];
			this.totalItems = success['data']['count'];
			this.start = (pageNumber - 1) * this.perPage + 1;
			this.end = (pageNumber - 1) * this.perPage + this.userList.length;
		}, error => {
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

	parseAccountStatus(isAccountEnabled) {
		if (isAccountEnabled) {
			return "ENABLED";
		} else {
			return "DISABLED"
		}
	}

	pageChange(page) {
		if (!isNaN(page)) {
			this.getRecipientListing(page, this.perPage, this.searchTerm);
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
					this.getRecipientListing(this.currentPage, this.perPage, this.searchTerm);
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
