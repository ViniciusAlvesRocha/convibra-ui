import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRevokeListingComponent } from './certificate-revoke-listing.component';

describe('CertificateRevokeListingComponent', () => {
  let component: CertificateRevokeListingComponent;
  let fixture: ComponentFixture<CertificateRevokeListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateRevokeListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRevokeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
