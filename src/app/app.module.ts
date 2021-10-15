import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppInterceptor } from './app.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailVerificationComponent } from './email-verification/email.verification.component';
import { ResetPasswordComponent } from './reset-password/reset.password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot.password.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './dashboard/main/main.component';

import { CertificateComponent } from './dashboard/certificate/certificate-listing/certificate.component';
import { CertificateDetailComponent } from './dashboard/certificate/certificate-detail/certificate.detail.component';
import { CertificateCreateComponent } from './dashboard/certificate/certificate-create/certificate-create.component';

import { CSVImportComponent } from './dashboard/bulkimport/csv-import/csv-import.component';
import { APIImportComponent } from './dashboard/bulkimport/api-import/api-import.component';

import { UserComponent } from './dashboard/user/user.component';
import { CourseComponent } from './dashboard/course/course.component';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplateComponent } from './dashboard/template/template.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { SharedCertificateComponent } from './dashboard/shared-certificate/shared.certificate.component';
import { VerificationRequestComponent } from './dashboard/verification-request/verification.request.component';
import { QRCodeModule } from 'angularx-qrcode';
import { BlockchainInfoComponent } from './dashboard/blockchain-info/blockchain.info.component';
import { RecipientCreateComponent } from './recipient-create/recipient.create.component';
import { PublicCertificateDetailComponent } from './public-certificate-detail/public.certificate.detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SignatoryComponent } from './dashboard/signatory/signatory.component';

import { MatStepperModule, MatInputModule, MatButtonModule, MatTabsModule } from '@angular/material';
import { RecipientComponent } from './dashboard/recipient/recipient.component';


import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule } from '@angular/material';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { SubAccountAdminComponent } from './dashboard/sub-account-admin/sub-account-admin.component';
import { AddSubAccountAdminComponent } from './dashboard/sub-account-admin/add-sub-account-admin/add-sub-account-admin.component';
import { ManageSubAccountAdminComponent } from './dashboard/sub-account-admin/manage-sub-account-admin/manage-sub-account-admin.component';
import { EditSubAccountAdminComponent } from './dashboard/sub-account-admin/edit-sub-account-admin/edit-sub-account-admin.component';
import { IssuerComponent } from './dashboard/issuer/issuer.component';
import { ManageIssuerComponent } from './dashboard/issuer/manage-issuer/manage-issuer.component';
import { AddIssuerComponent } from './dashboard/issuer/add-issuer/add-issuer.component';
import { EditIssuerComponent } from './dashboard/issuer/edit-issuer/edit-issuer.component';
import { VerifierComponent } from './dashboard/verifier/verifier.component';
import { ManageVerifierComponent } from './dashboard/verifier/manage-verifier/manage-verifier.component';
import { AddVerifierComponent } from './dashboard/verifier/add-verifier/add-verifier.component';
import { EditVerifierComponent } from './dashboard/verifier/edit-verifier/edit-verifier.component';
import { AddRecipientComponent } from './dashboard/recipient/add-recipient/add-recipient.component';
import { EditRecipientComponent } from './dashboard/recipient/edit-recipient/edit-recipient.component';
import { ManageRecipientComponent } from './dashboard/recipient/manage-recipient/manage-recipient.component';
import { InstanceSettingComponent } from './dashboard/instance-setting/instance-setting.component';
import { ApiConfigSettingComponent } from './dashboard/api-config-setting/api-config-setting.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
import { AddCsvImportComponent } from './dashboard/bulkimport/add-csv-import/add-csv-import.component';
import { TemplateVersionHistoryComponent } from './dashboard/template/template-version-history/template-version-history.component';
import { TemplateVersionUpdateComponent } from './dashboard/template/template-version-update/template-version-update.component';
import { AddTemplateComponent } from './dashboard/template/add-template/add-template.component';
import { ManageCourseComponent } from './dashboard/course/manage-course/manage-course.component';
import { AddCourseComponent } from './dashboard/course/add-course/add-course.component';
import { EditCourseComponent } from './dashboard/course/edit-course/edit-course.component';
import { CertificateRevokeListingComponent } from './dashboard/certificate/certificate-revoke-listing/certificate-revoke-listing.component';
import { CertificateRevokeCreateComponent } from './dashboard/certificate/certificate-revoke-create/certificate-revoke-create.component';
import { QrScannerComponent } from './dashboard/verification-request/qr-scanner/qr-scanner.component';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EmailTemplateComponent } from './dashboard/email-template/email-template.component';
import { ManageEmailTemplateComponent } from './dashboard/email-template/manage-email-template/manage-email-template.component';
import { AddEmailTemplateComponent } from './dashboard/email-template/add-email-template/add-email-template.component';
import { EditEmailTemplateComponent } from './dashboard/email-template/edit-email-template/edit-email-template.component';
import { RequestResponseComponent } from './dashboard/verification-request/request-response/request-response.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { ModuleActionComponent } from './shared/module-action/module-action.component';

import { ToastrModule } from 'ngx-toastr';
import { PreviewEmailTemplateComponent } from './dashboard/email-template/preview-email-template/preview-email-template.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    EmailVerificationComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    CertificateComponent,
    UserComponent,
    MainComponent,
    TemplateComponent,
    ProfileComponent,
    SharedCertificateComponent,
    CertificateCreateComponent,
    VerificationRequestComponent,
    CertificateDetailComponent,
    BlockchainInfoComponent,
    RecipientCreateComponent,
    PublicCertificateDetailComponent,
    CourseComponent,
    SignatoryComponent,
    RecipientComponent,
    CSVImportComponent,
    APIImportComponent,

    SubAccountAdminComponent,
    AddSubAccountAdminComponent,
    ManageSubAccountAdminComponent,
    EditSubAccountAdminComponent,
    IssuerComponent,
    ManageIssuerComponent,
    AddIssuerComponent,
    EditIssuerComponent,
    VerifierComponent,
    ManageVerifierComponent,
    AddVerifierComponent,
    EditVerifierComponent,
    AddRecipientComponent,
    EditRecipientComponent,
    ManageRecipientComponent,
    InstanceSettingComponent,
    ApiConfigSettingComponent,
    AddCsvImportComponent,
    TemplateVersionHistoryComponent,
    TemplateVersionUpdateComponent,
    AddTemplateComponent,
    ManageCourseComponent,
    AddCourseComponent,
    EditCourseComponent,
    CertificateRevokeListingComponent,
    CertificateRevokeCreateComponent,
    QrScannerComponent,
    EmailTemplateComponent,
    ManageEmailTemplateComponent,
    AddEmailTemplateComponent,
    EditEmailTemplateComponent,
    RequestResponseComponent,
    ModuleActionComponent,
    PreviewEmailTemplateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbPaginationModule,
    NgxUiLoaderModule,
    QRCodeModule,
    AutocompleteLibModule,
    MatStepperModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MDBBootstrapModule.forRoot(),
    PdfViewerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ZXingScannerModule,

    AngularEditorModule,

    ToastrModule.forRoot({
      preventDuplicates: true,
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
