import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from './user.service';
import { AlertService } from '../../common/alert.service';
import { SuperUser } from './super-user';
import { Issuer } from './issuer';
import { SubAdmin } from './sub-admin';
import { CommonService } from '../../common/common.service';
import { AuthenticationService } from '../../common/authentication.service';
import { Title } from '@angular/platform-browser';

import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
declare var $: any;

@Component({
    selector: 'app-dashboard-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    userList = [];
    totalItems = 0;
    start;
    end;
    superUser = new SuperUser(undefined, undefined, undefined);
    subAdmin = new SubAdmin(undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);    
    issuer = new Issuer(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    currentPage = 1;
    perPage = 20;
    currentUserId;
    isSuperAdmin = false;
    instanceSettingObj:any = {};
    authData:any;

    @ViewChild("form")
    issuerForm;
    @ViewChild("superUserForm")
    superUserForm;
    accountStatus;
    accountUserName;
    @ViewChild("fileInput")
    fileInput: ElementRef;
    @ViewChild("csvUploadForm")
    csvUploadForm;
    dropify;
    fileToUpload: File = null;
    csvFile;
    @ViewChild("subAdminForm")
    subAdminForm;
    @ViewChild("updatesubAdminForm")
    updatesubAdminForm;

    updatesubAdmin: {
        firstName: null,
        lastName: null,
        email: null,
        mongodbConnectionUrl: null,
        domainName:null,
        logo:null,
        favicon:null,
        loginPageLogo:null,
        homePageLeafletText:null,
        coinNameOnWallet:null,
        nameOfTheAccount:null,
        address:null,
        website:null,
        contactNumber:null
    };
    subadminId:any;
    accountID:any;
    currentUserRole:any;

    apiConfigDetails:any;
    url = 'https?://.+';
    // @ViewChild('scheduleTime') scheduleTime: ElementRef;
    apiConfigForm : FormGroup;

    isEnabled:any = false;

    constructor(private userService: UserService,
                private alertService: AlertService,
                formBuilder:FormBuilder,
                private commonService: CommonService,
                private titleService: Title,
                private authenticationService:AuthenticationService) 
    {
            this.apiConfigForm = formBuilder.group({
                'apiConfigUrl' : ['',[Validators.required,Validators.pattern(this.url)]],
                'scheduleType' : ['',Validators.required],
                'scheduleTime' : [''],
                'headerValue'  : ['',Validators.required],
                'isEnabled'    : ['']
              })

            this.apiConfigDetails={
                apiUrl:null,
                scheduleType:null,
                scheduleTime:null,
                headerValue:null,
                isEnabled:null
            } 
    }

    ngOnInit() {
        this.initializeDropify();
        this.getAllUsers(this.currentPage, this.perPage);
        this.setIsSuperAdmin();

        this.updatesubAdmin =  {
            firstName: null,
            lastName: null,
            email: null,
            mongodbConnectionUrl: null,
            domainName:null,
            logo:null,
            favicon:null,
            loginPageLogo:null,
            homePageLeafletText:null,
            coinNameOnWallet:null,
            nameOfTheAccount:null,
            address:null,
            website:null,
            contactNumber:null            
        };

        //Get Current User role and account ID

        this.authData         = this.authenticationService.getCurrentAuthData();
        this.currentUserRole  = this.authData.role;

        this.accountID = localStorage.getItem('accountID');
        // this.currentUserRole = localStorage.getItem('role');

        if(!this.accountID){
            this.accountID = sessionStorage.getItem('accountID');
            if(!this.accountID){
                this.accountID = false;
            }
        }

        // if(!this.currentUserRole){
        //     this.currentUserRole = sessionStorage.getItem('role');
        // }

        // $('#scheduleTime').bootstrapMaterialDatePicker({
        //     date: false,
        //     shortTime: false,
        //     format: 'HH:mm'
        // });
      
        this.userService.getAPIConfig().subscribe(success => {
            this.apiConfigDetails = success['data'];
        });
        
        /* this.getInstanceSetting(); */
    }

    /* getInstanceSetting(){
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {
            this.instanceSettingObj.domainName = success['data'].general.domainName;
            this.titleService.setTitle(this.instanceSettingObj.domainName+": User");

        }, error => {
            this.alertService.showError(error.error.message);
        }) 
    } */

    openAPIConfigModal(){
        $('#APIConfigModal').modal('show');
    }

    toggleforAPIConfig(event) {
        if (event.target.checked) {
            this.isEnabled = true;
        }else{
            this.isEnabled = false;
        }
    }

    updateAPIConfig(form:NgForm){

        // this.apiConfigForm.get('scheduleTime').setValue(this.scheduleTime.nativeElement.value);
    
        let apiConfigUrl = form.value.apiConfigUrl;
        let scheduleType = form.value.scheduleType;
        // let scheduleTime = $("#scheduleTime").val();
        let scheduleTime = '00:00';
        let headerValue  = form.value.headerValue;
        let isEnabled    = form.value.isEnabled;
        if(isEnabled == null){
            isEnabled = false;
        }
        // let isEnabled    = this.isEnabled;
    
        if(this.apiConfigForm.valid == false){
          this.alertService.showError('Please check all mandatory fields');
          return false;
        }
    
        
        this.userService.updateAPIConfig(apiConfigUrl,scheduleType,scheduleTime,headerValue,isEnabled).subscribe(success=>{
          this.alertService.showSuccess(success['message']);
          $('#APIConfigModal').modal('hide');
          this.ngOnInit();
        }, error => {
          this.alertService.showError(error.message);
        })
    }


    setIsSuperAdmin(){
        let role = localStorage.getItem('role');
        if(!role){
            role = sessionStorage.getItem('role');
        }
        this.isSuperAdmin = 'ROLE_SUPER_ADMIN'==role;
    }

    getAllUsers(pageNumber, limit) {
        this.userService.getUserList(pageNumber, limit).subscribe(success => {
            this.userList = success['data']['data'];
            this.totalItems = success['data']['count'];
            this.start = (pageNumber - 1) * this.perPage + 1;
            this.end = (pageNumber - 1) * this.perPage + this.userList.length;
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    pageChange(page) {
        if (!isNaN(page)) {
            this.getAllUsers(page, this.perPage);
        }
    }

    addSuperUser(form) {
        if (form.invalid) return;
        this.userService.addSuperUser(this.superUser).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getAllUsers(this.currentPage, this.perPage);
            $('#addSuperUser').modal('hide');
            form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    /* addSubAdmin(form) {
        // console.log(this.subAdmin); return;
        if (form.invalid) return;
        this.userService.addSubAdmin(this.subAdmin).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getAllUsers(this.currentPage, this.perPage);
            $('#addSubadmin').modal('hide');
            form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    } */

    updateSubAdmin(form) {
        
        if (form.invalid) return;
        this.userService.updateSubAdmin(this.updatesubAdmin,this.subadminId).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getAllUsers(this.currentPage, this.perPage);
            $('#updateSubadmin').modal('hide');
            form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    /* addIssuer(form) {
        if (form.invalid) return;
        this.userService.addIssuer(this.issuer).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getAllUsers(this.currentPage, this.perPage);
            $('#addIssuer').modal('hide');
            form.resetForm();
        }, error => {
            this.alertService.showError(error.message);
        })
    } */

    openApproveIssuerModal(userId){
        $('#approveIssuerModal').modal('show');
        this.currentUserId = userId;
    }

    approveIssuer(userId){
        this.userService.approveIssuer(userId).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getAllUsers(this.currentPage, this.perPage);
            $('#approveIssuerModal').modal('hide');
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    /* openAddIssuerModal(){
        this.issuerForm.resetForm();
        $('#addIssuer').modal('show');
    } */

    openAddSuperUserModal(){
        this.superUserForm.resetForm();        
        $('#addSuperUser').modal('show');
    }

    /* openAddSubAdminModal() {
        this.subAdminForm.resetForm();
        $('#addSubadmin').modal('show');
    } */

    openUpdateSubAdminModal(user) {        
        this.updatesubAdmin.firstName = user.firstName;
        this.updatesubAdmin.lastName = user.lastName;
        this.updatesubAdmin.email = user.email;
        this.updatesubAdmin.mongodbConnectionUrl = user.mongodbConnectionUrl;
        this.updatesubAdmin.domainName = user.domainName;
        this.updatesubAdmin.logo = user.logo;        
        this.updatesubAdmin.favicon = user.favicon;  
        this.updatesubAdmin.loginPageLogo = user.loginPageLogo;
        this.updatesubAdmin.homePageLeafletText = user.homePageLeafletText;
        this.updatesubAdmin.coinNameOnWallet = user.coinNameOnWallet;
        this.updatesubAdmin.nameOfTheAccount = user.nameOfTheAccount;
        this.updatesubAdmin.address = user.address;
        this.updatesubAdmin.website = user.website;
        this.updatesubAdmin.contactNumber = user.contactNumber;        
        this.subadminId = user._id;
                
        // this.subAdminForm.resetForm();
        $('#updateSubadmin').modal('show');
    }

    openChangeAccountStatus(user){
        this.currentUserId = user._id;
        this.accountStatus = "Enable";
        if(user.isAccountEnabled){
            this.accountStatus = "Disable";
        }
        this.accountUserName = user.firstName;
        $('#toggleAccount').modal('show');
    }

    parseRole(role){
        var result;
        switch(role){
            case 'ROLE_SUPER_ADMIN': result='SUPER ADMIN'
            break;
            case 'ROLE_DELEGATE_ADMIN': result='SUPER USER'
            break;
            case 'ROLE_ISSUER': result='ISSUER'
            break;
            case 'ROLE_RECIPIENT': result='RECIPIENT'
            break;
            case 'ROLE_VERIFIER': result='VERIFIER'
            break;
            case 'ROLE_SUB_ADMIN': result='SUB ADMIN'
            break;
            default : result='UNKNOWN'
            break;
        }
        return result;
    }

    parseEmailVerified(isEmailVerified) {
        if (isEmailVerified) {
            return "YES";
        } else {
            return "NO"
        }
    }

    parseAccountStatus(isAccountEnabled){
        if (isAccountEnabled) {
            return "ENABLED";
        } else {
            return "DISABLED"
        }
    }

    toggleAccountStatus(userId){
        this.userService.toggleAccountStatus(userId).subscribe(success => {
            this.alertService.showSuccess(success['message']);
            this.getAllUsers(this.currentPage, this.perPage);
            $('#toggleAccount').modal('hide');
        }, error => {
            this.alertService.showError(error.message);
        })
    }

    initializeDropify() {
        var self = this;
        $(function () {
            var drEvent = $('.dropify').dropify();
            self.dropify = drEvent;
            drEvent.on('dropify.beforeClear', function (event, element) {
                self.csvUploadForm.controls['template'].reset();
                return true;
            });
        });
    }

    openBulkRecipientModal(){
        this.dropify.data('dropify').resetPreview();
        $('#bulkRecipientModal').modal('show');
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }
    uploadCsvFile(){
        if (this.csvUploadForm.invalid) return;
        var fd = new FormData();
        if (this.fileToUpload.name && this.fileToUpload.name.split('.').pop().toLowerCase() == 'csv') {
            fd.append('file', this.fileToUpload);
            this.userService.uploadRecipientInBulk(fd).subscribe(success => {
                this.alertService.showSuccess(success['message']);
                this.getAllUsers(this.currentPage, this.perPage);
                $('#bulkRecipientModal').modal('hide');
                this.csvUploadForm.resetForm();
            }, error => {
                this.alertService.showError(error.message);
            })
        } else {
            this.alertService.showError("Please uplaod csv file");
        }
    }

}