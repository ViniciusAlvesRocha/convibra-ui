import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    constructor(private http: HttpClient) {

    }

    /* getTemplates(pageNumber, limit,filter) {
        return this.http.get('/api/v1/template/list', {
            params: {
                pageNumber: pageNumber,
                limit: limit,
                filter:JSON.stringify(filter)
            }
        })
    } */

    getTemplates(filter) {
        return this.http.get('/api/v1/template/list', {
            params: {
                filter: JSON.stringify(filter)
            }
        })
    }

    getCourses(pageNumber, limit) {
        return this.http.get('/api/v1/course/list', {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    addTemplate(fd:FormData) {

        return this.http.post('/api/v1/template/store',fd,{
            headers:{
                'enctype': 'multipart/form-data'
            }
        });
    }
   
    updateTemplateVersion(fd:FormData){

        return this.http.post('/api/v1/template/update_version',fd,{
            headers:{
                'enctype': 'multipart/form-data'
            }
        }); 
    }

    addCourse(data:FormData) {
        
        return this.http.post('/api/v1/course',data,{
            headers:{
                'enctype': 'multipart/form-data'
            }
        });
    }

    updateTemplate(fd:FormData,id) {
        return this.http.put('/api/v1/templates/'+id, fd,{
            headers:{
                'enctype': 'multipart/form-data'
            }
        });
    }

    deleteTemplate(templateId){
        return this.http.delete('/api/v1/template/'+templateId);
    }

    deleteCourse(courseId){
        return this.http.delete('/api/v1/course',{
            params:{
                courseId:courseId
            }
        })                  
    }   

    getConvocationDates(){
        return this.http.get('/api/v1/user/convocation/dates');
    }

    getFile(_fileId){
        return this.http.get('/api/v1/common/file/'+_fileId);
    }

    getVersionHistoryDetail(_parentId){
        return this.http.get('/api/v1/template/version_history/'+_parentId);
    }

    getTemplateDetails(_id){
        return this.http.get('/api/v1/template/detail/'+_id);
    }
}