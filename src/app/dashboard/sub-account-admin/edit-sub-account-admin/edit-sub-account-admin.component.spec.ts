import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubAccountAdminComponent } from './edit-sub-account-admin.component';

describe('EditSubAccountAdminComponent', () => {
  let component: EditSubAccountAdminComponent;
  let fixture: ComponentFixture<EditSubAccountAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubAccountAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubAccountAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
