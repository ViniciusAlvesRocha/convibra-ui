import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SignatoryService {
    constructor(private http: HttpClient) {

    }

    getSignatoryFiltered(pageNumber, limit,filter) {
        return this.http.get('/api/v1/signatoryFiltered', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                filter:JSON.stringify(filter)
            }
        })
    }
    
    getSignatory(pageNumber, limit) {
        return this.http.get('/api/v1/signatory', {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    addSignatory(data:FormData) {
        return this.http.post('/api/v1/signatory',data,{
            headers:{
                'enctype': 'multipart/form-data'
            }
        });
    }

    // updateSignatory(fd:FormData) {
    //     return this.http.post('/api/v1/signatory/update', fd);
    // }

    updateSignatory(signatoryID, fd:FormData){ 
        // console.log(signatoryID,fd); return;
        return this.http.post('/api/v1/signatory/update/'+signatoryID,fd,{
            headers:{
                'enctype': 'multipart/form-data'
            }
        });
    } 

    deleteSignatory(signatoryId){
        return this.http.delete('/api/v1/signatory',{
            params:{
                signatoryId:signatoryId
            }
        })
    }   

    allSignatory() {
        return this.http.get('/api/v1/allSignatory', {})
    }

    getSignatoryDetail(signatoryId){
        return this.http.get('/api/v1/getSignatoryDetail',{
            params:{
                signatoryId:signatoryId
            }
        })                  
    } 

   

}