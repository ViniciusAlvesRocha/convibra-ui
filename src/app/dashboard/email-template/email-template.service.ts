import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class EmailTemplateService {

	constructor(private http: HttpClient) {

	}

	getListing(pageNumber, limit){
		return this.http.get('/api/v1/email_template/listing', {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
	}

	getDetails(id,isOnlyView){
		return this.http.get('/api/v1/email_template/detail/'+id+'/'+isOnlyView);
	}

	storeEmailTemplate(frmData){
		return this.http.post('/api/v1/email_template/store', frmData);
	}

	updateEmailTemplate(frmData, id){
		return this.http.post('/api/v1/email_template/update/'+id, frmData);
	}

}
