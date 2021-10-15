import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertService } from '../../common/alert.service';
import { Location } from '@angular/common';
import { SignatoryService } from './signatory.service';
import { CommonService } from '../../common/common.service';
import { Title } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-signatory',
  templateUrl: './signatory.component.html',
  styleUrls: ['./signatory.component.css']
})
export class SignatoryComponent implements OnInit {
  coursesList: any[];
  totalItems = 0;
  start:any = 0;
  end:any = 0;
  currentPage = 1;
  perPage = 20;
  signatoryName;
  courses: any;
  dropify;
  instanceSettingObj: any = {};

  @ViewChild("form")
  form;
  @ViewChild("fileInput")
  fileInput: ElementRef;
  signatoryList: any[];
  SignatoryToUpload: File = null;
  signatoryId;
  signatoryImg;
  @ViewChild("editForm")
  editForm;
  EditSignatoryToUpload: File = null;
  @ViewChild("editFileInput")
  editSignatoryImg;
  // editSignatoryName;
  // editSignatoryImg;
  // editFileInput:ElementRef;
  // editSignatoryId;

  accountID: any;
  currentUserRole: any;
  newStartDate: any;

  @ViewChild('signatoryStartDateRef') signatoryStartDate: ElementRef;
  @ViewChild('signatoryEndDateRef') signatoryEndDate: ElementRef;
  @ViewChild('editSignatoryStartDate') editSignatoryStartDate: ElementRef;
  @ViewChild('editSignatoryEndDate') editSignatoryEndDate: ElementRef;

  signatoryDetails: any;
  constructor(private location: Location,
    private alertService: AlertService,
    private signatoryService: SignatoryService,
    private commonService: CommonService,
    private titleService: Title) {

    this.signatoryDetails = {
      signatoryName: null
    }
  }

  ngOnInit() {
    this.initializeDropify();
    this.getSignatory(this.currentPage, this.perPage);

    //Get Current User role and account ID

    this.accountID = localStorage.getItem('accountID');
    this.currentUserRole = localStorage.getItem('role');

    if (!this.accountID) {
      this.accountID = sessionStorage.getItem('accountID');
      if (!this.accountID) {
        this.accountID = false;
      }
    }

    if (!this.currentUserRole) {
      this.currentUserRole = sessionStorage.getItem('role');
    }

    $('#signatoryStartDate').bootstrapMaterialDatePicker({
      format: 'DD MMMM YYYY',
      clearButton: true,
      time: false,
      minDate: new Date()
    }).on('change', function (e, date) {
      $('#signatoryEndDate').bootstrapMaterialDatePicker('setMinDate', date);
    });

    $('#signatoryEndDate').bootstrapMaterialDatePicker({
      format: 'DD MMMM YYYY',
      clearButton: true,
      time: false
    });

    $('#editSignatoryStartDate').bootstrapMaterialDatePicker({
      format: 'DD MMMM YYYY',
      clearButton: true,
      time: false,
      minDate: new Date()
    }).on('change', function (e, date) {
      $('#editSignatoryEndDate').bootstrapMaterialDatePicker('setMinDate', date);
    });

    $('#editSignatoryEndDate').bootstrapMaterialDatePicker({
      format: 'DD MMMM YYYY',
      clearButton: true,
      time: false
    });

    /* this.getInstanceSetting(); */
  }

  /* getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
        this.instanceSettingObj.domainName = success['data'].general.domainName;
        this.titleService.setTitle(this.instanceSettingObj.domainName+": Signatory");

    }, error => {
        this.alertService.showError(error.error.message);
    }) 
} */

  goBack() {
    this.location.back();
  }

  pageChange(page) {
    if (!isNaN(page)) {
      this.getSignatory(this.currentPage, this.perPage);
      // this.getCourses(page, 10);
    }
  }

  openSignatoryModal() {
    this.form.resetForm();
    $('#openSignatoryModal').modal('show');
  }

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

  addSignatory(form) {

    form.form.get('signatoryStartDateRef').setValue($("#signatoryStartDate").val());
    form.form.get('signatoryEndDateRef').setValue($("#signatoryEndDate").val());

    if (form.invalid) return;
    var fd = new FormData();

    if (this.SignatoryToUpload.name && (this.SignatoryToUpload.name.split('.').pop().toLowerCase() == 'png' ||
      this.SignatoryToUpload.name.split('.').pop().toLowerCase() == 'jpg' ||
      this.SignatoryToUpload.name.split('.').pop().toLowerCase() == 'jpeg')) {
      fd.append('signatoryName', this.signatoryName);
      fd.append('signatory', this.SignatoryToUpload);
      fd.append('startDate', $("#signatoryStartDate").data('plugin_bootstrapMaterialDatePicker').currentDate);
      fd.append('endDate', $("#signatoryEndDate").data('plugin_bootstrapMaterialDatePicker').currentDate);

      this.signatoryService.addSignatory(fd).subscribe(success => {
        this.alertService.showSuccess(success['message']);
        this.getSignatory(this.currentPage, this.perPage);
        form.resetForm();
        $('#openSignatoryModal').modal('hide');
      }, error => {
        this.alertService.showError(error.message);
      })
    }
    else {
      this.alertService.showError("Please upload image file");
    }
  }

  editSignatory(editForm) {

    editForm.form.get('editSignatoryStartDateRef').setValue($("#editSignatoryStartDate").val());
    editForm.form.get('editSignatoryEndDateRef').setValue($("#editSignatoryEndDate").val());

    if (editForm.invalid) return;
    var fd = new FormData();

    fd.append("signatoryName", editForm.form.get('editSignatoryNameRef').value);
    fd.append('signatory', this.EditSignatoryToUpload);
    fd.append('startDate', $("#editSignatoryStartDate").val());
    fd.append('endDate', $("#editSignatoryEndDate").val());

    // fd.append('startDate',$("#editSignatoryStartDate").data('plugin_bootstrapMaterialDatePicker').currentDate);
    // fd.append('endDate',$("#editSignatoryEndDate").data('plugin_bootstrapMaterialDatePicker').currentDate);

    this.signatoryService.updateSignatory(this.signatoryDetails._id, fd).subscribe(success => {
      this.alertService.showSuccess(success['message']);
      this.getSignatory(this.currentPage, this.perPage);
      $('#openEditSignatoryModal').modal('hide');
      this.ngOnInit();
    }, error => {
      this.alertService.showError(error.message);
    })

  }


  getSignatory(pageNumber, limit) {
    this.signatoryService.getSignatory(pageNumber, limit).subscribe(success => {
      this.signatoryList = success['data']['data'];
      this.totalItems = success['data']['count'];
      this.start = (pageNumber - 1) * this.perPage + 1;
      this.end = (pageNumber - 1) * this.perPage + this.signatoryList.length;
    }, error => {
      this.alertService.showError(error.message);
    })
  }

  handleSignatoryFileInput(files: FileList) {
    this.SignatoryToUpload = files.item(0);
  }

  handleEditSignatoryFileInput(files: FileList) {
    this.EditSignatoryToUpload = files.item(0);
  }

  viewSignatory(id) {
    /* let token = localStorage.getItem('token');
    if (!token) {
        token = sessionStorage.getItem('token');
    } */

    let token = "";
    window.open(`/api/v1/signatory/${id}?auth=${token}`, '_blank');
  }

  openDeleteSignatoryModal(signatoryId) {
    $('#openDeleteSignatoryModal').modal('show');
    this.signatoryId = signatoryId;
  }

  deleteSignatoy() {
    this.signatoryService.deleteSignatory(this.signatoryId).subscribe(success => {
      this.alertService.showSuccess(success['message']);
      this.getSignatory(this.currentPage, this.perPage);
      $('#openDeleteSignatoryModal').modal('hide');
    }, error => {
      this.alertService.showError(error.message);
    })
  }

  openEditSignatoryModal(signatory) {
    $('#openEditSignatoryModal').modal('show');
    this.signatoryDetails = signatory;
    this.signatoryDetails.startDate = this.convertUnixTimetoDate(this.signatoryDetails.startDate);
    this.signatoryDetails.endDate = this.convertUnixTimetoDate(this.signatoryDetails.endDate);
  }

  convertUnixTimetoDate(timestamp) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var date = new Date(timestamp);
    var datevalues = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    return datevalues;
  }

}
