import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../certificate/certificate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';

@Component({
  selector: 'app-request-response',
  templateUrl: './request-response.component.html',
  styleUrls: ['./request-response.component.css']
})
export class RequestResponseComponent implements OnInit {

  certificateID:any;
  verificationMessages:any;

  constructor(private certificateService:CertificateService,
              private route:ActivatedRoute,
              private alertService:AlertService,
              private router:Router) { }

  ngOnInit() {
    this.certificateID = this.route.snapshot.params.id;
    // console.log(this.certificateID);
    this.getRequestListing();
  }

  getRequestListing(){
    try {
      let _promis = this.certificateService.getRequestResponse(this.certificateID).toPromise();
      _promis.then((response:any)=>{
        if(response.status == 'success'){
          this.verificationMessages = response.data;
          // console.log(this.verificationMessages);
        }
      }).catch(error=>{
        this.alertService.showError('Sorry, No Verification Request Found!');
        this.router.navigateByUrl('/dashboard/certificate/shared');
      })
    } catch (error) {
      this.alertService.showError(error.message);
    }
  }

}
