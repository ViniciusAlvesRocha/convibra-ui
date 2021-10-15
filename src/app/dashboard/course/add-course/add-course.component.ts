import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { CourseService } from '../course.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  addCourseForm:FormGroup;
  instanceSettingObj:any = {};

  constructor(private formBuilder:FormBuilder,
              private alertService:AlertService,
              private courseService:CourseService,
              private route:Router,
              private location:Location,
              private ngxService:NgxUiLoaderService,
              private commonService: CommonService,
              private titleService: Title) {
    this.addCourseForm = this.formBuilder.group({
      nameLang1:['',Validators.required],
      nameLang2:['',Validators.required]
    })
   }

  ngOnInit() {
    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
        this.instanceSettingObj.domainName = success['data'].general.domainName;
        this.titleService.setTitle(this.instanceSettingObj.domainName+": Add Course");

    }, error => {
        this.alertService.showError(error.error.message);
    }) 
  }

  clickBack(){
    this.location.back();
  }

  addCourse(){
    if(this.addCourseForm.invalid){
      this.alertService.showError('Please check all fields');
      return false;
    }
    let frmValue = this.addCourseForm.value;
    // console.log(frmValue);
    
    try {
      //this.ngxService.start();
      let _promise = this.courseService.addCourse(frmValue).toPromise();
      _promise.then((response:any)=>{
        if(response.status == 'success'){
          //this.ngxService.stop();
          this.alertService.showSuccess(response.message);
          this.route.navigateByUrl('/dashboard/course/manage');
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
