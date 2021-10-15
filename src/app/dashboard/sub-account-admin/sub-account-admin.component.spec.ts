import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountAdminComponent } from './sub-account-admin.component';

describe('SubAccountAdminComponent', () => {
  let component: SubAccountAdminComponent;
  let fixture: ComponentFixture<SubAccountAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAccountAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
