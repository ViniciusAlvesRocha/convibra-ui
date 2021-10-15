import { Component } from '@angular/core';
import { Login } from './login';
import { AuthenticationService } from '../common/authentication.service';
import { AlertService } from '../common/alert.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  login = new Login(undefined, undefined);
  rememberMe = false;
  reRouteMap: {};
  instanceSettingObj: any = {};

  constructor(private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private alertService: AlertService,
    private titleService: Title,
    private router: Router) { }

  ngOnInit() {
    let token = this.authenticationService.getCurrentAccessToken();
    if (token) {
      this.router.navigate(['/dashboard']);
    }

    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
      
      this.instanceSettingObj.logo = '/api/v1/common/file/'+success['data'].general.logo+"?entity=image";
      this.instanceSettingObj.companyImg = '/api/v1/common/file/'+success['data'].general.organizationPicture+"?entity=image";
      this.instanceSettingObj.favicon = '/api/v1/common/file/'+success['data'].general.favicon+"?entity=image";
      this.instanceSettingObj.domainName = success['data'].general.domainName;
      this.titleService.setTitle(this.instanceSettingObj.domainName+": Login");
      
      this.commonService.setFavicon(this.instanceSettingObj.favicon);
    }, error => {
      this.alertService.showError(error.message);
    }) 
  }

  authenticateUser(form) {
    if (form.invalid) {
      this.alertService.showError("Please provide valid email and password.");
      return;
    }

    this.authenticationService.login(this.login).subscribe(success => {

      this.alertService.showSuccess(success['message'],{
        showConfirmButton: false,
        timer: 2000
      });

      /* Re route  */
      if (success['data']['role'] == 'ROLE_RECIPIENT') {
        this.router.navigate(['/dashboard/certificate']);
      }
      else if (success['data']['role'] == 'ROLE_VERIFIER') {
        this.router.navigate(['/dashboard/certificate/shared']);
      }
      else if (success['data']['role'] == 'ROLE_ISSUER') {
        this.router.navigate(['/dashboard/profile']);
      }
      else {
        this.router.navigate(['/dashboard']);
      }

      this.authenticationService.setCurrentAuthData(success['data']);
      /* for (let key in success['data']) {
          localStorage.setItem(key, success['data'][key]);
          sessionStorage.setItem(key, success['data'][key]);
      } */
    }, error => {
      
      this.alertService.showError(error.message);
    })
  }
}