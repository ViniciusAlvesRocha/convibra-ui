import { Component, OnInit } from '@angular/core';
import { AlertService } from '../common/alert.service';
import { AuthenticationService } from '../common/authentication.service';
import { CommonService } from '../common/common.service';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot.password.component.html',
  styleUrls: ['./forgot.password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  instanceSettingObj: any = {};

  constructor(private authenticationService:AuthenticationService,
              private alertService:AlertService,
              private commonService: CommonService,
              private titleService: Title) {
              
              this.forgotPasswordForm = new FormGroup({
			          email: new FormControl("", [Validators.required, Validators.email]),
              });
              
              }

  ngOnInit() {
    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
      
      this.instanceSettingObj.logo = '/api/v1/common/file/'+success['data'].general.logo+"?entity=image";
      this.instanceSettingObj.companyImg = '/api/v1/common/file/'+success['data'].general.organizationPicture+"?entity=image";
      this.instanceSettingObj.favicon = '/api/v1/common/file/'+success['data'].general.favicon+"?entity=image";
      this.instanceSettingObj.domainName = success['data'].general.domainName;
      this.titleService.setTitle(this.instanceSettingObj.domainName+": Forgot Password");
      
      this.commonService.setFavicon(this.instanceSettingObj.favicon);
    }, error => {
      this.alertService.showError(error.message);
    }) 
  }

  forgotPassword(){
    if (this.forgotPasswordForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
    var frmValue = this.forgotPasswordForm.value;
    
    
    this.authenticationService.forgotPassword(frmValue.email).subscribe(success => {
      this.alertService.showSuccess(success['message']);
      this.forgotPasswordForm.reset();
    }, error => {
      this.alertService.showError(error.message);
      //this.forgotPasswordForm.reset();
    })
  }
}
