import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubAccountAdminComponent } from './manage-sub-account-admin.component';

describe('ManageSubAccountAdminComponent', () => {
  let component: ManageSubAccountAdminComponent;
  let fixture: ComponentFixture<ManageSubAccountAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubAccountAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubAccountAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
