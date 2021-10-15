import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../common/alert.service';
import { AuthenticationService } from '../common/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../common/common.service';
import { Title } from '@angular/platform-browser';

 function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}

@Component({
  selector: 'app-recipient-create',
  templateUrl: './recipient.create.component.html',
  styleUrls: ['./recipient.create.component.css']
})
export class RecipientCreateComponent implements OnInit {
  recipientForm:FormGroup;
  token:any;
  instanceSettingObj:any = {};

  constructor(private authenticationService:AuthenticationService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private alertService:AlertService,
    private formBuilder:FormBuilder,
    private commonService: CommonService,
    private titleService: Title) {
      this.recipientForm = this.formBuilder.group({
        'newPassword':['',[Validators.required,Validators.email]],
        'confirmPassword':['',[Validators.required,Validators.email]]
      },{
        validator: MustMatch('newPassword','confirmPassword')
      });
     }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.params.token;
    // console.log(this.token);
    this.getInstanceSetting();
  }

  getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
        this.instanceSettingObj.domainName = success['data'].general.domainName;
        this.titleService.setTitle(this.instanceSettingObj.domainName+": Create Recipient");

    }, error => {
        this.alertService.showError(error.error.message);
    }) 
}

  createRecipient(){
    if(this.recipientForm.invalid){
      this.alertService.showError('Please check all fields')
      return false;
    }
    var frmValue = this.recipientForm.value;
    frmValue['token'] = this.token;
    try {
      var _promis = this.authenticationService.recipientCreation(frmValue).toPromise();
      _promis.then((response:any)=>{
        if(response.status == 'success'){
          this.alertService.showSuccess(response.message);
          setTimeout(() => {
            this.router.navigateByUrl('/login');  
          }, 3000);
          
        }
      }).catch(e=>{
        this.alertService.showError(e.message)
      })
    } catch (error) {
      this.alertService.showError(error.message);
    }
  }

}
