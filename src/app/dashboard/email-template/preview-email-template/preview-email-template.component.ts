import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../../common/alert.service';
import { EmailTemplateService } from '../email-template.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-preview-email-template',
  templateUrl: './preview-email-template.component.html',
  styleUrls: ['./preview-email-template.component.css']
})
export class PreviewEmailTemplateComponent implements OnInit {

  activeEmailTemplateId: any;
  emailTemplateDetails: any;
  isOnlyView: boolean = true;

  @ViewChild('templateHtmlDiv') templateHtmlDiv: ElementRef;

  constructor(private emailTemplateService: EmailTemplateService,
    private alertService: AlertService,
    private _router: Router,
		private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeEmailTemplateId = this._activatedRoute.snapshot.paramMap.get("id");
    this.getDetails();
  }

  getDetails() {
		try {
			let _promise = this.emailTemplateService.getDetails(this.activeEmailTemplateId,this.isOnlyView).toPromise();
			_promise.then((response: any) => {
				if (response.status == 'success') {
          this.emailTemplateDetails = response.data;
          this.templateHtmlDiv.nativeElement.innerHTML = this.emailTemplateDetails.templateHtml;
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			});
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

}
