import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-certificate-revoke-create',
  templateUrl: './certificate-revoke-create.component.html',
  styleUrls: ['./certificate-revoke-create.component.css']
})
export class CertificateRevokeCreateComponent implements OnInit {

  addRevokeCertificateForm: FormGroup;
  instanceSettingObj:any = {};

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: Router,
    private certificateService: CertificateService,
    private commonService: CommonService,
    private titleService: Title,
    private location:Location) {

    this.addRevokeCertificateForm = this.formBuilder.group({
      certificateHash: ['', Validators.required],
      reason: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getInstanceSetting();
  }

  clickBack(){
    this.location.back();
  }

  getInstanceSetting(){
      let paramData = ["general"];
      this.commonService.getInstanceSetting(paramData).subscribe(success => {
          this.instanceSettingObj.domainName = success['data'].general.domainName;
          this.titleService.setTitle(this.instanceSettingObj.domainName+": Revoke Certificate");

      }, error => {
          this.alertService.showError(error.message);
      }) 
  }

  addRevokeCertificate() {
    let frmValue = this.addRevokeCertificateForm.value;
    // console.log(frmValue);
    try {
      let _promis = this.certificateService.addRevokeCertificate(frmValue).toPromise();
      _promis.then((response: any) => {
        if (response.status == 'success') {
          this.alertService.showSuccess(response.message);
          this.route.navigateByUrl('/dashboard/certificates/revoke')
        }
      }).catch(error => {
        this.alertService.showError(error.message);
      })
    } catch (error) {
      this.alertService.showError(error.message);
    }
  }

}
