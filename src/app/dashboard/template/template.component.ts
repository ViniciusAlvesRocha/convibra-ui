import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TemplateService } from './template.service';
import { AlertService } from '../../common/alert.service';
import { AuthenticationService } from '../../common/authentication.service';
import { CommonService } from '../../common/common.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-dashboard-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

    templateList: any[];
    coursesList: any[];
    totalItems = 0;
    start;
    end;
    currentPage = 0;

    /*  Template  */
    templateName: any;
    templateDescription: any;
    templateVersion: any;
    templateValidity: any;
    templateStartDate: any;
    templateEndDate: any;
    templateFile: File;

    activeTemplate: any;
    authData: any;


    courseName;
    coursesName;
    signatoryName;
    desc;
    ver;
    validity;
    signatory;
    courses: any;
    signatoryimg: File;
    templateId;
    course;
    fileToUpload: File = null;
    fileToUploadEdit: File = null;
    SignatoryToUpload: File = null;
    @ViewChild("form") form;
    @ViewChild("fileInput") fileInput: ElementRef;
    @ViewChild("fileInputEdit") fileInputEdit: ElementRef;
    dropify;
    keyword = 'courseName';
    signatoryKeyword = 'signatoryName';


    accountID: any;
    currentUserRole: any;
    language: any;
    forPrinting: any = false;

    processingTemplateAdd: any = false;
    processingTemplateEdit: any = false;

    instanceSettingObj: any = {};

    // filteredCourseID: any;

    constructor(private templateService: TemplateService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private titleService: Title
    ) {

    }

    ngOnInit() {

        this.forPrinting = false;
        // this.toggleForPrinting(event);

        this.activeTemplate = {};
        this.templateList = [];
        this.coursesList = [];
        this.initializeDropify();
        this.getTemplates({ "parentID": null });

        /* this.getInstanceSetting(); */

        //Get Current User role and account ID

        this.authData = this.authenticationService.getCurrentAuthData();
        this.currentUserRole = this.authData.role;

        this.accountID = localStorage.getItem('accountID');
        // this.currentUserRole = localStorage.getItem('role');

        if (!this.accountID) {
            this.accountID = sessionStorage.getItem('accountID');
            if (!this.accountID) {
                this.accountID = false;
            }
        }

        // if(!this.currentUserRole){
        //     this.currentUserRole = sessionStorage.getItem('role');
        // }        

        /*  Initialize Date Picker  */

        $('#templateStartDate').bootstrapMaterialDatePicker({
            format: 'DD MMMM YYYY',
            clearButton: true,
            // weekStart: 1,
            time: false,
            minDate: new Date()
        }).on('change', function (e, date) {
            $('#templateEndDate').bootstrapMaterialDatePicker('setMinDate', date);
        });

        $('#templateEndDate').bootstrapMaterialDatePicker({
            format: 'DD MMMM YYYY',
            clearButton: true,
            // weekStart: 1,
            time: false
        });

        $('#editTemplateStartDate').bootstrapMaterialDatePicker({
            format: 'DD MMMM YYYY',
            clearButton: true,
            // weekStart: 1,
            time: false,
            minDate: new Date()
        }).on('change', function (e, date) {
            $('#editTemplateEndDate').bootstrapMaterialDatePicker('setMinDate', date);
        });

        $('#editTemplateEndDate').bootstrapMaterialDatePicker({
            format: 'DD MMMM YYYY',
            clearButton: true,
            // weekStart: 1,
            time: false
        });


    }

    /* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Template List");
    
        }, error => {
            // this.alertService.showError(error.message);
            console.log('Instance Setting Error: ',error.message);
        }) 
      } */

    initializeDropify() {
        var self = this;
        $(function () {
            var drEvent = $('.dropify').dropify();
            self.dropify = drEvent;
            drEvent.on('dropify.beforeClear', function (event, element) {
                self.form.controls['template'].reset();
                return true;
            });
        });
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    handleFileEditInput(files: FileList) {
        this.fileToUploadEdit = files.item(0);
    }

    handleSignatoryFileInput(files: FileList) {
        this.SignatoryToUpload = files.item(0);
    }

    toggleForPrinting(event) {
        if (event.target.checked) {
            this.forPrinting = true;
        } else {
            this.forPrinting = false;
        }
    }

    toggleEditForPrinting(event) {
        if (event.target.checked) {
            this.activeTemplate.forPrinting = true;
        } else {
            this.activeTemplate.forPrinting = false;
        }
    }


    /*  Template Section  */
    addTemplate(form) {

        form.form.get('startDateRef').setValue($("#templateStartDate").val());
        form.form.get('endDateRef').setValue($("#templateEndDate").val());


        if (form.form.invalid) return;
        var fd = new FormData();
        if (this.fileToUpload.name && this.fileToUpload.name.split('.').pop().toLowerCase() == 'docx') {

            fd.append('description', this.templateDescription);
            fd.append('version', this.templateVersion);
            fd.append('validityDate', this.templateValidity);
            fd.append('templateName', this.templateName);
            fd.append('language', this.language);
            fd.append('forPrinting', this.forPrinting);
            fd.append('template', this.fileToUpload);
            fd.append('startDate', $("#templateStartDate").data('plugin_bootstrapMaterialDatePicker').currentDate);
            fd.append('endDate', $("#templateEndDate").data('plugin_bootstrapMaterialDatePicker').currentDate);

            this.processingTemplateAdd = true;
            this.templateService.addTemplate(fd).subscribe(success => {
                this.alertService.showSuccess(success['message']);
                this.getTemplates({ "parentID": null });
                $('#openAddTemplateModal').modal('hide');
                form.resetForm();
                this.ngOnInit();
                this.processingTemplateAdd = false;
            }, error => {
                this.alertService.showError(error.message);
            })


        } else {
            this.alertService.showError("Please uplaod docx file");
        }
    }

    updateTemplate(form) {
        form.form.get('startDateRef').setValue($("#editTemplateStartDate").val());
        form.form.get('endDateRef').setValue($("#editTemplateEndDate").val());


        if (form.form.invalid) return;
        var fd = new FormData();
        try {
            if (this.fileToUploadEdit.name && this.fileToUploadEdit.name.split('.').pop().toLowerCase() != 'docx') {
                this.alertService.showError("Please uplaod docx file");
            }
        }
        catch (e) { }


        fd.append('description', this.activeTemplate.description);
        fd.append('version', this.activeTemplate.version);
        fd.append('validityDate', this.activeTemplate.validityDate);
        fd.append('templateName', this.activeTemplate.templateName);
        fd.append('template', this.fileToUploadEdit);
        fd.append('startDate', $("#editTemplateStartDate").val());
        fd.append('endDate', $("#editTemplateEndDate").val());
        fd.append('language', this.activeTemplate.language);
        fd.append('forPrinting', this.activeTemplate.forPrinting);

        // fd.append('startDate', $("#editTemplateStartDate").data('plugin_bootstrapMaterialDatePicker').currentDate);  
        // fd.append('endDate', $("#editTemplateEndDate").data('plugin_bootstrapMaterialDatePicker').currentDate);  

        this.processingTemplateEdit = true;
        this.templateService.updateTemplate(fd, this.activeTemplate._id).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getTemplates({ "parentID": null });
            $('#openEditTemplateModal').modal('hide');
            this.ngOnInit();
            this.processingTemplateEdit = false;
            // form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    getTemplates(filter) {
        this.templateService.getTemplates(filter).subscribe(success => {
            this.templateList = success['data'];
            this.totalItems = success['data'].length;
            this.start = 1;
            this.end = this.templateList.length;
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    deleteTemplate() {
        this.templateService.deleteTemplate(this.templateId).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getTemplates({ "parentID": null });
            $('#openDeleteTemplateModal').modal('hide');
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    async openAddTemplateModal(form) {

        setTimeout(() => {
            $("#languageRef").selectpicker('refresh');
        }, 500);

        form.resetForm();
        this.dropify.data('dropify').resetPreview();
        $('#openAddTemplateModal').modal('show');

    }

    openDeleteTemplateModal(templateId) {
        $('#openDeleteTemplateModal').modal('show');
        this.templateId = templateId;
    }

    openEditTemplateModal(template) {

        setTimeout(() => {
            $("#editLanguageRef").selectpicker('refresh');
        }, 500);

        $('#openEditTemplateModal').modal('show');
        this.activeTemplate = template;
        this.activeTemplate.language = "" + this.activeTemplate.language + "";
        this.activeTemplate.startDate = this.convertUnixTimetoDate(this.activeTemplate.startDate);
        this.activeTemplate.endDate = this.convertUnixTimetoDate(this.activeTemplate.endDate);
    }

    convertUnixTimetoDate(timestamp) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var date = new Date(timestamp);
        var datevalues = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
        return datevalues;
    }

    viewTemplate(id) {
        let token = this.authData.token;
        /* let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        } */

        if (id == null) {
            this.alertService.showError("Preview file not available");
        } else {
            window.open(`/api/v1/common/file/${id}`, '_blank');
        }
    }


    /*  Course Section  */

    getCourses(pageNumber, limit) {
        this.templateService.getCourses(pageNumber, limit).subscribe(success => {
            this.coursesList = success['data']['data'];
            this.totalItems = success['data']['count'];
            this.start = (pageNumber - 1) * 10 + 1;
            this.end = (pageNumber - 1) * 10 + this.coursesList.length;
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    addCourse(form) {
        if (form.invalid) return;

        this.templateService.addCourse(form.value).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getCourses(this.currentPage, 0);
            form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    editCourse(courseName, courseId) {

        // this.templateService.addCourse(courseId).subscribe(success => {
        //     this.alertService.showSuccess(success['message']);
        //     this.getCourses(this.currentPage, 0);                
        // }, error => {
        //     this.alertService.showError(error.message);
        // })        
    }



    deleteCourse(courseId) {
        this.templateService.deleteCourse(courseId).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getCourses(this.currentPage, 0);

        }, error => {
            this.alertService.showError(error.message);
        })
    }



    openCoursesModal() {
        this.form.resetForm();
        $('#openCoursesModal').modal('show');
    }



    selectEvent(item) {
        // do something with selected item        
        this.coursesName = item.courseName;
        this.signatoryName = item.signatoryName;
    }

    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e) {
        // do something when input is focused     
    }


    setCurrentCourse() {

    }
}