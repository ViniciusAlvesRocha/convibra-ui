import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVerifierComponent } from './manage-verifier.component';

describe('ManageVerifierComponent', () => {
  let component: ManageVerifierComponent;
  let fixture: ComponentFixture<ManageVerifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVerifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
