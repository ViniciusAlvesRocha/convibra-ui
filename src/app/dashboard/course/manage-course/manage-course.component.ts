import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { AlertService } from 'src/app/common/alert.service';
import { CommonService } from '../../../common/common.service';
import { AuthenticationService } from '../../../common/authentication.service';
import { Title } from '@angular/platform-browser';

// import Swal from ''
declare var $:any;

@Component({
  selector: 'app-manage-course',
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.css']
})
export class ManageCourseComponent implements OnInit {

  start:any = 0;
  end:any = 0;
  totalItems:any;

  currentPage = 1;
  perPage = 20;
  coursesList: any = [];
  currentCoursID:any;
  currentUserRole:any = false;
  accountID:any = false;
  instanceSettingObj:any = {};
  authData:any;


  constructor(private coureseService: CourseService,
              private alertService: AlertService,
              private commonService: CommonService,
              private titleService: Title,
              private authenticationService:AuthenticationService) {
      
     }

  ngOnInit() {
    this.authData         = this.authenticationService.getCurrentAuthData();
    this.currentUserRole  = this.authData.role;

    this.getCourses(this.currentPage, this.perPage);
    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
        this.instanceSettingObj.domainName = success['data'].general.domainName;
        this.titleService.setTitle(this.instanceSettingObj.domainName+": Course List");

    }, error => {
        // this.alertService.showError(error.message);
        console.log('Instance Setting Error',error.message);
    }) 
  }

  getCourses(pageNumber, limit) {
    this.coureseService.getCourseList(pageNumber, limit).subscribe(success => {
        this.coursesList = success['data']['courseData'];
        this.totalItems = success['data']['count'];
        this.start = (pageNumber - 1) * this.perPage + 1;
        this.end = (pageNumber - 1) * this.perPage + this.coursesList.length;
    }, error => {
        this.alertService.showError(error.message);
    })
  }

  pageChange(page) {
    if (!isNaN(page)) {
        this.getCourses(page, this.perPage);
    }
  }

  openConfirmModel(_id) {
    this.currentCoursID = _id;
    $('#toggleAccount').modal('show');
  }

  /* deleteCourse(currentCoursID,data) {
    try {
      let _promise = this.coureseService.deleteCourse(currentCoursID,data).toPromise();
      _promise.then((response:any)=>{
        if(response.status == 'success'){
          this.alertService.showSuccess(response.message);
          $('#toggleAccount').modal('hide');
          this.ngOnInit();
        }
      }).catch(error=>{
        this.alertService.showError(error.message);
      })
    } catch (error) {
      this.alertService.showError(error.message);
    }
  } */

}
