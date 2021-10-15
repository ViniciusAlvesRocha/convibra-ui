import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { TemplateService } from '../template.service';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { Router } from "@angular/router"

declare var $: any;

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {

  templateStoreForm: FormGroup;
  webDocFileError = false;
  printDocFileError = false;
  instanceSettingObj: any = {};

  @ViewChild('webDocument') webDocument: ElementRef;
  @ViewChild('printDocument') printDocument: ElementRef;

  constructor(public formBuilder: FormBuilder,
    private alertService: AlertService,
    private templateService: TemplateService,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title) {

    this.templateStoreForm = formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      webDocument: new FormControl(""),
      printDocument: [""],
      language: ["", [Validators.required]]
    });

  }

  ngOnInit() {
    /* this.getInstanceSetting(); */

    setTimeout(() => {
      $("#language").selectpicker('refresh');
    }, 500);
  }

  /* getInstanceSetting(){
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
        this.instanceSettingObj.domainName = success['data'].general.domainName;
        this.titleService.setTitle(this.instanceSettingObj.domainName+": Add Template");

    }, error => {
        this.alertService.showError(error.error.message);
    }) 
} */

  storeTemplate() {
    if (this.templateStoreForm.invalid) {
      this.alertService.showError("All fields require");
      return false;
    }

    if (this.webDocument == undefined) {
      this.alertService.showError("Please upload web document file");
      return false;
    }

    if (this.printDocument == undefined) {
      this.alertService.showError("Please upload print document file");
      return false;
    }

    if (this.webDocFileError == true) {
      this.alertService.showError("Please upload valid doc file");
      return false;
    }

    if (this.printDocFileError == true) {
      this.alertService.showError("Please upload valid doc file");
      return false;
    }

    if (this.webDocument.nativeElement.files[0] == undefined) {
      this.alertService.showError("Please upload web document file");
      return false;
    }

    if (this.printDocument.nativeElement.files[0] == undefined) {
      this.alertService.showError("Please upload print document file");
      return false;
    }

    let frmValue = this.templateStoreForm.value;

    frmValue.startDate = moment(frmValue.startDate).format("YYYY-MM-DD");
    frmValue.endDate = moment(frmValue.endDate).format("YYYY-MM-DD");

    let frmData = new FormData();
    frmData.append("name", frmValue.name);
    frmData.append("description", frmValue.description);
    frmData.append("startDate", frmValue.startDate);
    frmData.append("endDate", frmValue.endDate);
    frmData.append("webDocument", this.webDocument.nativeElement.files[0]);
    frmData.append("printDocument", this.printDocument.nativeElement.files[0]);
    frmData.append("language", frmValue.language);

    try {
      var _promis = this.templateService.addTemplate(frmData).toPromise();
      _promis.then((response: any) => {
        if (response.status == 'success') {
          this.alertService.showSuccess(response.message);
          this.router.navigate(['/dashboard/template']);
        }
      }).catch(error => {
        this.alertService.showError(error.message);
      })
    } catch (error) {
      this.alertService.showError(error.message);
    }
  }

  updateWebFile(e) {
    if (this.webDocument.nativeElement.files[0].type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      this.webDocFileError = true;
      this.alertService.showError("Please upload valid doc file");
      return false;
    }
    else {
      this.webDocFileError = false;
    }
  }

  updatePrintFile(e) {
    if (this.printDocument.nativeElement.files[0].type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      this.printDocFileError = true;
      this.alertService.showError("Please upload valid doc file");
      return false;
    }
    else {
      this.printDocFileError = false;
    }
  }
}
