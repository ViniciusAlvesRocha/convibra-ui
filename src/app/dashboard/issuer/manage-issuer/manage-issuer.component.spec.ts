import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIssuerComponent } from './manage-issuer.component';

describe('ManageIssuerComponent', () => {
  let component: ManageIssuerComponent;
  let fixture: ComponentFixture<ManageIssuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIssuerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIssuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
