import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRevokeCreateComponent } from './certificate-revoke-create.component';

describe('CertificateRevokeCreateComponent', () => {
  let component: CertificateRevokeCreateComponent;
  let fixture: ComponentFixture<CertificateRevokeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateRevokeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRevokeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
