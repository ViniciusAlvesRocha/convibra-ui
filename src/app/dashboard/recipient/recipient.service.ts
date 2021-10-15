import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    'providedIn':'root'
})
export class RecipientService{
    constructor(private http:HttpClient){

    }
    
    getRecipientList(pageNumber, limit, searchTerm) {
        return this.http.get('/api/v1/user/listing', {
            params: {
                role: 'ROLE_RECIPIENT',
                pageNumber: pageNumber,
                limit: limit,
                searchTerm: (JSON.stringify(searchTerm))
            }
        });
    }

    getLoggedinUserID(token){
        return this.http.get('/api/v1/getLoggedinUserID', {
            params: {
                token: token
            }
        });
    }
}