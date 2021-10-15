import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { CourseService } from '../course.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {

  editCourseForm:FormGroup;
  courseID:any;
  courseDetails:any=[];
  instanceSettingObj:any = {};

  constructor(private formBuilder:FormBuilder,
              private alertService:AlertService,
              private courseService:CourseService,
              private route:ActivatedRoute,
              private location:Location,
              private ngxService:NgxUiLoaderService,
              private commonService: CommonService,
                private titleService: Title) {
                this.editCourseForm = this.formBuilder.group({
                  nameLang1:['',Validators.required],
                  nameLang2:['',Validators.required]
                })
               }

  ngOnInit() {
    this.courseID = this.route.snapshot.params.id;
    // console.log(this.courseID);
    this.getCourseDetails();
    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
        this.instanceSettingObj.domainName = success['data'].general.domainName;
        this.titleService.setTitle(this.instanceSettingObj.domainName+": Edit Course");

    }, error => {
        this.alertService.showError(error.error.message);
    }) 
}

  back(){
    this.location.back();
  }

  getCourseDetails(){
    try {
      //this.ngxService.start();
      let _promise = this.courseService.getCourseDetail(this.courseID).toPromise();
      _promise.then((response:any)=>{
        if(response.status == 'success'){
          //this.ngxService.stop();
          this.courseDetails = response.data;
          // console.log(this.courseDetails)

          this.editCourseForm.get('nameLang1').setValue(response.data.nameLang1);
          this.editCourseForm.get('nameLang2').setValue(response.data.nameLang2);
        }
      }).catch(error=>{
        //this.ngxService.stop();
        this.alertService.showError(error.message);
      })
    } catch (error) {
      //this.ngxService.stop();
      this.alertService.showError(error.message);
    }
  }

  UpdateCourse(){
    if (this.editCourseForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
    }
    let frmValue = this.editCourseForm.value;
    try {
      //this.ngxService.start();
      let _promise = this.courseService.updateCourse(this.courseID,frmValue).toPromise();
      _promise.then((response:any)=>{
        if(response.status == 'success'){
          //this.ngxService.stop();
          this.alertService.showSuccess(response.message);
        }
      }).catch(error=>{
        //this.ngxService.stop();
        this.alertService.showError(error.message);
      })
    } catch (error) {
      //this.ngxService.stop();
      this.alertService.showError(error.message);
    }
  }

}
