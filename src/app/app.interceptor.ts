import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './common/alert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { AuthenticationService } from './common/authentication.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                private alertService:AlertService,
                private authService:AuthenticationService,
                private ngxService: NgxUiLoaderService
            ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.ngxService.start();
        
        let token = this.authService.getCurrentAccessToken();

        let clonedRequest =  req.clone();    

        if (token) {
            // let clonedRequest = req.clone({ headers: req.headers.set('Authorization', token).set('Authorization',43) });
           clonedRequest =  req.clone({
               headers: new HttpHeaders({
                    'Authorization': token
                })
           });    
        }

        /* https://tdev.app/ngx-ui-loader/demo/ */
        

        return next.handle(clonedRequest).pipe(
            catchError((_error:HttpErrorResponse) =>{
                console.log(_error,"_error");
                this.ngxService.stop();
                return this.handleError(_error);
            }),
            finalize(() => {
                this.ngxService.stop();
            })
        )
    }

    handleError(_error){
        if (_error.status === 401 || _error.status === 403) {
            this.alertService.showError("Session expired login again");
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/']);
        }
        else if(_error.status === 504)
        {
            this.alertService.showError(_error.statusText);
            return throwError(new Error(_error.statusText))
        }
        
        return throwError(_error.error);
    }
}
