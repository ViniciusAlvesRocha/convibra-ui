import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BulkImportService {
    constructor(private http: HttpClient) {

    }

    getList(pageNumber,limit,filter) {
        return this.http.get('/api/v1/recipient_import/queue/list', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                filter:(JSON.stringify(filter))
            }
        })
    }

    

    uploadRecipientInBulk(fd:FormData){
        return this.http.post('/api/v1/recipient_import/csv',fd);
    }

    getAPIImportQueueList(pageNumber, limit) {
        return this.http.get('/api/v1/bulkimport/getRecipientAPIImportQueueList', {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    getApiFieldConfigInfo(){
        return this.http.get('/api/v1/instance_setting/api_field');
    }
}