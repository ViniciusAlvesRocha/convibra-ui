import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubAccountAdminComponent } from './add-sub-account-admin.component';

describe('AddSubAccountAdminComponent', () => {
  let component: AddSubAccountAdminComponent;
  let fixture: ComponentFixture<AddSubAccountAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubAccountAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubAccountAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
