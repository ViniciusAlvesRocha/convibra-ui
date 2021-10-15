import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { TemplateService } from '../../template/template.service';
import { CourseService } from '../../course/course.service';
import { AlertService } from '../../../common/alert.service';
import { AuthenticationService } from '../../../common/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { RecipientService } from '../../recipient/recipient.service';
import { SignatoryService } from '../../signatory/signatory.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import { FormGroup, FormControl } from '@angular/forms';

declare var $: any, csv: any;

@Component({
    selector: 'app-dashboard-create-certificate',
    templateUrl: './certificate-create.component.html',
    styleUrls: ['./certificate-create.component.css']
})
export class CertificateCreateComponent implements OnInit {

    // THIS COMPONENT USES JQUERY EXTENSIVELY BECAUSE OF JQUERY WIZARD 
    templateList: any = [];
    coursesList: any = [];
    recipientData: any = [];
    signatoryList: any = [];

    isIssuerVerified = false;
    initAutoCompleteReceipt: any;
    isLinear = false;
    token: any = false;
    searchTerm: any = "";
    certificateDate: any = "";

    selectedTemplateId: any = [];
    selectedRecipients: any = [];
    recipientsList: any = [];
    selectedCourse: any = [];
    selectedTemplateName: any = [];
    selectedSignature: any = [];

    selectedTemplate: any[] = [];
    convoDates: any;
    convocationDate: any;

    courseDropDownList = [];
    courceDropDownSettings = {};

    arrSelectedCourse = [];
    issuerPrivateKey: String;
    instanceSettingObj:any = {};

    @ViewChild('courses') courses: ElementRef;
    @ViewChild('selectedTemp') selectedTemp: ElementRef;
    @ViewChild('privateKeyFile') privateKeyFile: ElementRef;

    filterRecipientDetailsFrm: FormGroup
    privateKeyUploadFrm: FormGroup

    constructor(private certificateService: CertificateService,
        private templateService: TemplateService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private courseService: CourseService,
        private userService: UserService,
        private signatoryServie: SignatoryService,
        private recipientService: RecipientService,
        private commonService: CommonService,
        private titleService: Title) {

        this.searchTerm = {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            courseID: "",
            convocationDateLang: "",
            batch: "",
            isCertificateCreatePage: true
        }

        this.certificateDate = null;
        this.selectedCourse = "";
        this.selectedSignature = null;
        this.selectedTemplate = [];

        this.token = this.authenticationService.getCurrentAccessToken();

        this.filterRecipientDetailsFrm = new FormGroup({
            'filterCourses': new FormControl(''),
            'filterConvoDate': new FormControl(''),
            'filterFirstName': new FormControl(''),
            'filterLastName': new FormControl(''),
            'filterEmail': new FormControl(''),
            'filterMobileNumber': new FormControl(''),
        })

        this.privateKeyUploadFrm = new FormGroup({
            privateKeyFile: new FormControl("")
        });
    }

    ngOnInit() {
        this.loadCourses();
        this.getAllConvocationDates();


        this.courceDropDownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true
        };

        this.getInstanceSetting();
    }

    getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": Certificate Create");

        }, error => {
            this.alertService.showError(error.message);
        }) 
    }

    async changeCertificateDate(type: string, event: MatDatepickerInputEvent<Date>) {
        let tmpDate = event.target.value;

        let newDate = moment(tmpDate).format("YYYY-MM-DD");


        this.templateService.getTemplates({ 'date': newDate }).subscribe((templateData)=>{
    
            let buildData = [];
            if (templateData['data'].length > 0) {
                templateData['data'].forEach((template, index) => {
                    buildData.push(template);

                    let tmpUrl = '';

                    if (template.previewPdf != null || template.previewPdf != undefined) {
                        tmpUrl = '/api/v1/common/file/' + template.previewPdf;
                    }

                    buildData[index].previewUrl = tmpUrl;
                });
            }

            this.templateList = buildData;
        },error => {
            this.templateList = [];
            this.alertService.showError(error.message);
        });   

    }

    async getAllConvocationDates() {
        let convocationDateData = await this.templateService.getConvocationDates().toPromise();
        this.convoDates = convocationDateData['data'];
    }


    convoDateFilter = (d: Date): boolean => {
        d.setHours(0, 0, 0);

        let visibleDates = this.convoDates.map(function (val, index) {
            var tmpDate = new Date(val);
            tmpDate.setHours(0, 0, 0);
            return tmpDate.toISOString();
        });


        return (visibleDates.includes(d.toISOString()));
    }

    changeConvocationDate(type: string, event: MatDatepickerInputEvent<Date>) {
        let tmpDate = event.target.value;
        // this.searchTerm.convocationDateLang = new Date(tmpDate).getTime();
        this.searchTerm.convocationDateLang = tmpDate;
        // console.log(tmpDate);

        let _convoDate = moment(this.searchTerm.convocationDateLang).format("YYYY-MM-DD");

        this.searchTerm.convocationDateLang = _convoDate;

        this.onChangeSearch(this.searchTerm.convocationDateLang);
    }


    filterRecords() {
        this.onChangeSearch(this.searchTerm);
    }

    getIssuerStatus() {

        this.authenticationService.getLoggedInUserInfo().subscribe(success => {
            if (success['data'].issuerVerified) {
                this.isIssuerVerified = true;
            }
            /* START temporary part */
            this.isIssuerVerified = true;
            /* STOP temporary part */
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    resetCertificateFields() {
        $("#courses").val("");
        $("#certRecipientName").val("");
        $("#certDate").val("");
        $("#certRecipientEmail").val("");
    }

    createPreview(currentIndex, self) {
        if (currentIndex == 2) {
            if (self.recipientData.length == 0) {
                $("#noData").show();
                $("#previewTable").hide();
            } else {
                $("#noData").hide();
                $("#previewTable").show();
                var certificationName = $("#courses").find(":selected").text();
                var inHTML = "";
                $.each(self.recipientData, function (index, value) {
                    var newItem = "<tr>"
                        + "<th scope='row'>" + parseInt(index + 1) + "</td>"
                        + "<td>" + value.certRecipientName + "</td>"
                        + "<td>" + value.certRecipientEmail + "</td>"
                        + "<td>" + certificationName + "</td>"
                        + "<td>" + value.certDate + "</td>"
                        + "</tr>";
                    inHTML += newItem;
                });
                $("#previewTableBody").html(inHTML);
            }
        }
    }

    async loadCourses() {
        try {
            let tmpCourse = await this.courseService.getCourseList(0, 0).toPromise()
            this.coursesList = tmpCourse['data']['courseData'];
            this.courseDropDownList = [];

            if (this.coursesList.length > 0) {
                let tmpArr = [];
                this.coursesList.forEach((course) => {
                    let tmpObj = {};
                    tmpObj['item_id'] = course._id;
                    tmpObj['item_text'] = course.nameLang1;

                    tmpArr.push(tmpObj);
                });

                this.courseDropDownList = tmpArr;
            }

        }
        catch (e) {

        }

    }



    async getSignatoryFiltered(tmpDate) {
        try {
            let tmpSelectedSignature: any = await this.signatoryServie.getSignatoryFiltered(0, 0, { date: tmpDate }).toPromise();
            this.selectedSignature = tmpSelectedSignature._id;
        }
        catch (e) {

        }

    }


    removeSelectedReceipt(index) {
        if (index !== -1) {
            this.selectedRecipients.splice(index, 1);
        }
    }


    onChangeSearch(keyword: string) {
        // console.log(this.searchTerm);

        /* this.searchTerm */
        this.recipientService.getRecipientList(1, 0, this.searchTerm).subscribe(success => {
            this.recipientsList = success['data']['userData'];


            for (let _user of this.recipientsList) {
                _user['name'] = _user.firstName + ' ' + _user.lastName
            }

            this.selectedRecipients = this.recipientsList;

        }, error => {
            this.selectedRecipients = [];

            console.log(this.selectedRecipients);
            this.alertService.showError(error.message);
        })

    }

    finishSteps() {

        this.selectedTemplateName = $("#courses").find(":checked").text();

        let selectedTemplates = [];
        $("input[name=selectedTemp]:checked").each((_index, _elem) => {
            selectedTemplates.push($(_elem).val());
        });


        if (selectedTemplates.length <= 0) {
            this.alertService.showError('Please select template');
            return false;
        }

        let certDate = $('#certDate').val();
        if (certDate == '') {
            this.alertService.showError('Please select certificate date');
            return false;
        }

        if (this.selectedRecipients.length == 0) {
            this.alertService.showError('Please select at least one recipient');
            return false;
        }

        if(this.issuerPrivateKey == undefined || this.issuerPrivateKey == ""){
            this.alertService.showError('Please upload private key file');
            return false;
        }

        if(this.arrSelectedCourse.length <= 0){
            this.alertService.showError('Please select atleast one course');
            return false;
        }

        var requestData = {
            recipientID: [],
            privateKey: this.issuerPrivateKey,
            templateID: selectedTemplates,
            // signatoryId:this.selectedSignature,
            certificationDate: moment(certDate).format("DD-MM-YYYY"),
            /* certificationName: this.selectedTemplateName, */
            courseID: this.arrSelectedCourse
        }



        for (let data of this.selectedRecipients) {

            /* requestData.recipientID.push({
                certificationName: this.selectedTemplateName,
                issuedTo: data.name,
                issuedToId: data._id,
                email: data.email,
                certificationDate: certDate
            }) */

            requestData.recipientID.push(data._id)
        }


        this.certificateService.issueCertificate(requestData).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            // this.resetCertificateFields();
            this.router.navigate(['/dashboard/certificate']);
        }, error => {
            this.alertService.showError(error.message);
        })

    }


    onCourseSelect(event) {

        this.arrSelectedCourse.push(event.item_id);

        this.searchTerm.courseID = this.arrSelectedCourse;
        this.onChangeSearch("course");
    }

    onCourseDeSelect(event){

        let removeId = event.item_id;
        let index = this.arrSelectedCourse.indexOf(removeId);

        if (index > -1) {
            this.arrSelectedCourse.splice(index, 1);
          }
        
        this.searchTerm.courseID = this.arrSelectedCourse;

        this.onChangeSearch("course");
    }

    privateKeyFileUploaded(event){
        
        let frmData = new FormData();
        frmData.append("privateKeyFile", this.privateKeyFile.nativeElement.files[0]);
        
        try {
            var _promis = this.certificateService.verifyPrivateKey(frmData).toPromise();
            _promis.then((response: any) => {
              if (response.status == 'success') {
                this.alertService.showSuccess(response.message);
                this.issuerPrivateKey = response.data.privateKey;
              }
            }).catch(error => {
              this.alertService.showError('Invalid private key file');
            })
          } catch (error) {
            this.alertService.showError(error.message);
          }
    }

}