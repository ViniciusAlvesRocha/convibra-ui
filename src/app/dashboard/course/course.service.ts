import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    constructor(private http: HttpClient) {}

    getCourseList(pageNumber, limit) {
        return this.http.get('/api/v1/course/list', {
            params: {
                pageNumber: pageNumber,
                limit: limit
            }
        })
    }

    addCourse(frmData) {
        
        return this.http.post('/api/v1/course/create',frmData);
    }

    getCourseDetail(courseId){
        return this.http.get('/api/v1/course/details/'+courseId);           
    } 

    updateCourse(courseId,frmData){ 
        return this.http.post('/api/v1/course/update/'+courseId,frmData);
    } 
    
    /* deleteCourse(courseId,data){
        return this.http.post('/api/v1/course/delete/'+courseId,data);
    }  */   
    
}