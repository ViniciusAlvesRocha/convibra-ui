import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../common/alert.service';
import { AuthenticationService } from '../common/authentication.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email.verification.component.html',
  styleUrls: ['./email.verification.component.css'],
})
export class EmailVerificationComponent implements OnInit {

  constructor(private authenticationService:AuthenticationService,private router:Router, private alertService: AlertService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.verifyEmail();
  }

  verifyEmail(){
    let token = this.activatedRoute.snapshot.params.token;
    this.authenticationService.verifyEmail(token).subscribe(success=>{
      this.alertService.showSuccess(success['message']);
      this.router.navigate(['/']);
    },error=>{
      this.alertService.showError(error.message);
      this.router.navigate(['/']);
    })
  }

}
