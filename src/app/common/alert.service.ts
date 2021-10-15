import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn:'root'
})
export class AlertService{
    
    constructor(public toastr: ToastrService) {
    }

    showSuccess(_message?,_option?) {
        this.toastr.success(_message, null,_option);
    }   

    showError(_message?,_option?) {
        this.toastr.error(_message, null,_option);
    }

    showWarning( _message?,_option?) {
        this.toastr.warning(_message, null,_option);
    }

    showInfo( _message?,_option?) {
        this.toastr.info(_message, null,_option);
    }
}