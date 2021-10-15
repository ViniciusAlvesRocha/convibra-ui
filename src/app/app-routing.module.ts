import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot.password.component';
import { ResetPasswordComponent } from './reset-password/reset.password.component';
import { EmailVerificationComponent } from './email-verification/email.verification.component';

import { MainComponent } from './dashboard/main/main.component';

import { CertificateComponent } from './dashboard/certificate/certificate-listing/certificate.component';
import { CertificateDetailComponent } from './dashboard/certificate/certificate-detail/certificate.detail.component';
import { CertificateCreateComponent } from './dashboard/certificate/certificate-create/certificate-create.component';

import { CSVImportComponent } from './dashboard/bulkimport/csv-import/csv-import.component';
import { APIImportComponent } from './dashboard/bulkimport/api-import/api-import.component';



import { UserComponent } from './dashboard/user/user.component';
import { TemplateComponent } from './dashboard/template/template.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { SharedCertificateComponent } from './dashboard/shared-certificate/shared.certificate.component';
import { VerificationRequestComponent } from './dashboard/verification-request/verification.request.component';
import { BlockchainInfoComponent } from './dashboard/blockchain-info/blockchain.info.component';
import { RecipientCreateComponent } from './recipient-create/recipient.create.component';
import { PublicCertificateDetailComponent } from './public-certificate-detail/public.certificate.detail.component';
import { SignatoryComponent } from './dashboard/signatory/signatory.component';
import { RecipientComponent } from './dashboard/recipient/recipient.component';


import { ManageSubAccountAdminComponent } from './dashboard/sub-account-admin/manage-sub-account-admin/manage-sub-account-admin.component';
import { AddSubAccountAdminComponent } from './dashboard/sub-account-admin/add-sub-account-admin/add-sub-account-admin.component';
import { EditSubAccountAdminComponent } from './dashboard/sub-account-admin/edit-sub-account-admin/edit-sub-account-admin.component';

import { ManageIssuerComponent } from './dashboard/issuer/manage-issuer/manage-issuer.component';
import { AddIssuerComponent } from './dashboard/issuer/add-issuer/add-issuer.component';
import { EditIssuerComponent } from './dashboard/issuer/edit-issuer/edit-issuer.component';

import { ManageVerifierComponent } from './dashboard/verifier/manage-verifier/manage-verifier.component';
import { AddVerifierComponent } from './dashboard/verifier/add-verifier/add-verifier.component';
import { EditVerifierComponent } from './dashboard/verifier/edit-verifier/edit-verifier.component';

import { ManageRecipientComponent } from './dashboard/recipient/manage-recipient/manage-recipient.component';
import { AddRecipientComponent } from './dashboard/recipient/add-recipient/add-recipient.component';
import { EditRecipientComponent } from './dashboard/recipient/edit-recipient/edit-recipient.component';
import { InstanceSettingComponent } from './dashboard/instance-setting/instance-setting.component';

import { ApiConfigSettingComponent } from './dashboard/api-config-setting/api-config-setting.component';
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

import { EmailTemplateComponent } from './dashboard/email-template/email-template.component';
import { ManageEmailTemplateComponent } from './dashboard/email-template/manage-email-template/manage-email-template.component';
import { AddEmailTemplateComponent } from './dashboard/email-template/add-email-template/add-email-template.component';
import { EditEmailTemplateComponent } from './dashboard/email-template/edit-email-template/edit-email-template.component';
import { PreviewEmailTemplateComponent } from './dashboard/email-template/preview-email-template/preview-email-template.component';

import { RequestResponseComponent } from './dashboard/verification-request/request-response/request-response.component';

const routes: Routes = [{
  component: LoginComponent,
  path: ''
},

{
  component: SignupComponent,
  path: 'signup',
  data: { title: 'Signup' }
}, {
  component: DashboardComponent,
  path: 'dashboard',
  children: [
    {
      component: MainComponent,
      path: '',
      data: { title: 'Dashboard' }
    }, {
      component: CertificateComponent,
      path: 'certificate',
      data: { title: 'Certificate(s)' }
    }, {
      component: UserComponent,
      path: 'user',
      data: { title: 'User(s)' }
    },
    {
      component: CSVImportComponent,
      path: 'bulkimport/recipient',
      data: { title: 'Bulk Import : Recipient(s)' }

    },
    {
      component: AddCsvImportComponent,
      path: 'bulkimport/recipient/add',
      data: { title: 'Bulk Import : Recipient(s) : Add' }
    }
    ,
    {
      component: APIImportComponent,
      path: 'apiImport/recipient',
      data: { title: 'API Import : Recipient(s)' }
    },
    {
      component: TemplateComponent,
      path: 'template',
      data: { title: 'Template(s)' }
    },
    {
      component: TemplateVersionHistoryComponent,
      path: 'template/version-history/:id',
      data: { title: 'Template Version History' }
    },
    {
      component: TemplateVersionUpdateComponent,
      path: 'template/update-version/:id',
      data: { title: 'Template : Update' }
    },
    {
      component: AddTemplateComponent,
      path: 'template/add',
      data: { title: 'Template : Add' }
    },
    {
      component: ManageCourseComponent,
      path: 'course/manage',
      data: { title: 'Course(s)' }
    },
    {
      component: AddCourseComponent,
      path: 'course/add',
      data: { title: 'Course : Add' }
    },
    {
      component: EditCourseComponent,
      path: 'course/edit/:id',
      data: { title: 'Course : Update' }
    },
    {
      component: SignatoryComponent,
      path: 'signatory',
      data: { title: 'Signatory(s)' }
    }, {
      component: ProfileComponent,
      path: 'profile',
      data: { title: 'Profile' }
    }, {
      component: CertificateCreateComponent,
      path: 'certificates/create',
      data: { title: 'Certificate(s) : Add' }
    },
    {
      component: SharedCertificateComponent,
      path: 'certificate/shared',
      data: { title: 'Certificate(s) : Shared' }
    },
    {
      component: CertificateRevokeListingComponent,
      path: 'certificates/revoke',
      data: { title: 'Certificate(s) : Revoked' }
    },
    {
      component: CertificateRevokeCreateComponent,
      path: 'certificate/revoke/add',
      data: { title: 'Certificate(s) : Revoked : Add' }
    },
    {
      component: VerificationRequestComponent,
      path: 'verification/request',
      data: { title: 'Verifification(s) : Request' }
    },
    {
      component: RequestResponseComponent,
      path: 'verification/response/:id',
      data: { title: 'Verifification(s) : Request Details' }
    },
    {
      component: QrScannerComponent,
      path: 'verification/qr-scan',
      data: { title: 'Verifification(s) : QR Scan' }
    }
    , {
      component: CertificateDetailComponent,
      path: 'certificate/:id',
      data: { title: 'Certificate(s) : Details' }
    }, {
      component: BlockchainInfoComponent,
      path: 'blockchain',
      data: { title: 'Blockchain Info' }
    }, {
      component: RecipientComponent,
      path: 'issuer/recipients',
      data: { title: 'Recipient(s)' }
    },
    {
      loadChildren: "../app/block-explorer/block-explorer.module#BlockExplorerModule",
      path: 'block-explorer',
      data: { title: 'Block Explorer' }
    }, {
      component: InstanceSettingComponent,
      path: 'instance-setting',
      data: { title: 'Instance Setting' }
    },
    {
      component: ManageSubAccountAdminComponent,
      path: 'sub-account-admin',
      data: { title: 'Sub Account Admin' }
    },
    {
      component: AddSubAccountAdminComponent,
      path: 'sub-account-admin/add',
      data: { title: 'Sub Account Admin : Add' }
    },
    {
      component: EditSubAccountAdminComponent,
      path: 'sub-account-admin/edit/:id',
      data: { title: 'Sub Account Admin : Update' }
    },

    {
      component: ManageIssuerComponent,
      path: 'issuer',
      data: { title: 'Issuer(s)' }
    },
    {
      component: AddIssuerComponent,
      path: 'issuer/add',
      data: { title: 'Issuer(s) : Add' }
    },
    {
      component: EditIssuerComponent,
      path: 'issuer/edit/:id',
      data: { title: 'Issuer(s) : Update' }
    },

    {
      component: ManageVerifierComponent,
      path: 'verifier',
      data: { title: 'Verifier(s)' }
    },
    {
      component: AddVerifierComponent,
      path: 'verifier/add',
      data: { title: 'Verifier(s) : Add' }
    },
    {
      component: EditVerifierComponent,
      path: 'verifier/edit/:id',
      data: { title: 'Verifier(s) : Update' }
    },
    {
      component: ManageRecipientComponent,
      path: 'recipient',
      data: { title: 'Recipient(s)' }
    },
    {
      component: AddRecipientComponent,
      path: 'recipient/add',
      data: { title: 'Recipient(s) : Add' }
    },
    {
      component: EditRecipientComponent,
      path: 'recipient/edit/:id',
      data: { title: 'Recipient(s) : Update' }
    },
    {
      component: ApiConfigSettingComponent,
      path: 'api-config-setting',
      data: { title: 'API Config Settings' }
    },
    {
      component: ManageEmailTemplateComponent,
      path: 'email-template',
      data: { title: 'Email Setting(s)' }
    },
    {
      component: AddEmailTemplateComponent,
      path: 'email-template/add',
      data: { title: 'Email Setting(s) : Add' }
    },
    {
      component: EditEmailTemplateComponent,
      path: 'email-template/edit/:id',
      data: { title: 'Email Setting(s) : Update' }
    },
    {
      component: PreviewEmailTemplateComponent,
      path: 'email-template/preview/:id',
      data: { title: 'Email Settings(s) : Preview' }
    }
  ]
}, {
  path: 'forgot/password',
  component: ForgotPasswordComponent,
  data: { title: 'Forgot Password' }
}, {
  path: 'reset/password/:token',
  component: ResetPasswordComponent,
  data: { title: 'Reset Password' }
}, {
  path: 'email/verification/:token',
  component: EmailVerificationComponent,
  data: { title: 'Email Verification' }
}, {
  path: 'recipient/creation/:token',
  component: RecipientCreateComponent,
  data: { title: 'Recipient Token Verification' }
}, 
{
  loadChildren: "../app/block-explorer/block-explorer.module#BlockExplorerModule",
  path: 'public/block-explorer',
  data: { title: 'Block Explorer' }
},
{
  component: PublicCertificateDetailComponent,
  path: 'public/certificate/:id',
  data: { title: 'Certificate Details' }
}, {
  path: '**',
  component: LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
