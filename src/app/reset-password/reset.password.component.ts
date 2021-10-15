import { Component, OnInit } from '@angular/core';
import { Password } from './password';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../common/alert.service';
import { AuthenticationService } from '../common/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.password.component.html',
  styleUrls: ['./reset.password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password = new Password(undefined,undefined,this.activatedRoute.snapshot.params.token);

  constructor(private authenticationService:AuthenticationService,private router:Router,private activatedRoute:ActivatedRoute,private alertService:AlertService) { }

  ngOnInit() {
  }

  resetPassword(form){
    if(form.invalid || form.controls.newPassword.value != form.controls.confirmPassword.value) return;
    this.authenticationService.resetPassword(this.password).subscribe(success=>{
      this.alertService.showSuccess(success['message']);
      this.router.navigate(['/']);
    },error=>{
      this.alertService.showError(error.message);
    })

  }

}
