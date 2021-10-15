import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RecipientService } from './recipient.service';
import { AlertService } from '../../common/alert.service';
import { ThrowStmt } from '@angular/compiler';

import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../course/course.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { TemplateService } from '../template/template.service';
declare var $: any;

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.css']
})
export class RecipientComponent implements OnInit {
  recipientList = [];
  totalItems = 0;
  start;
  end;
  currentPage = 1;
  searchTerm:any ;
  userId:any;
  perPage = 20;
  
  convocationDate:any;
  coursesList: any[];
  selectedCourse: any;
  @ViewChild('courses') courses: ElementRef;

  convoDates:any;
  
  constructor(private recipientService: RecipientService, 
              private alertService: AlertService,
              private courseService:CourseService,
              private templateService: TemplateService,
              formBuilder:FormBuilder) {

   
    this.searchTerm = {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber:"",
      courseID:"",
      convocationDate:"",
      batch:""
    }  
    this.coursesList = [];  
    this.selectedCourse = "";   
    
   
  }
  
  ngOnInit() {

    // this.courseService.getCourses(0,0).subscribe(success => {            
    //   this.coursesList = success['data']['data'];  

      /* $(this.coursesList).each( (i, v) => {
          $(this.courses.nativeElement).append($("<option>", { value: v._id, html: v.courseName }));
      }); */

      
    // });

    this.getAllRecipients(this.currentPage, this.perPage, this.searchTerm);

    this.getAllConvocationDates();
  }
  
  

  clearFilter(){
    window.location.reload();
  }

  issueCertificateToCurrentList(){
    localStorage.setItem('issueCertificateCandidateFilter',JSON.stringify(this.searchTerm));
  }

  openAPIConfigModal(){
    $('#APIConfigModal').modal('show');
  }

  getAllRecipients(pageNumber, limit, searchTerm) {
    this.recipientService.getRecipientList(pageNumber, limit, searchTerm).subscribe(success => {
        this.recipientList = success['data']['userData'];
        this.totalItems = success['data']['count'];
        this.start = (pageNumber - 1) * this.perPage + 1;
        this.end = (pageNumber - 1) * this.perPage + this.recipientList.length;
    }, error => {
        this.alertService.showError(error.message);
    })
  }

  filterRecords(){
    this.currentPage = 1;
    this.ngOnInit();
  }

  changeConvocationDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let tmpDate = event.target.value;
    // this.searchTerm.convocationDate = new Date(tmpDate).getTime();
    this.searchTerm.convocationDate = tmpDate;
    this.ngOnInit();
  }

  pageChange(page) {
    if (!isNaN(page)) {
        this.getAllRecipients(page, this.perPage, this.searchTerm);
    }
  }

  async getAllConvocationDates(){
    let convocationDateData = await this.templateService.getConvocationDates().toPromise();
    this.convoDates = convocationDateData['data'];
  }

  convoDateFilter = (d: Date): boolean => {
    d.setHours(0,0,0);

    let visibleDates = this.convoDates.map(function(val, index){
        var tmpDate =  new Date(val);
        tmpDate.setHours(0,0,0);
        return tmpDate.toISOString();
    });

    
    return (visibleDates.includes(d.toISOString()));
  }
}
