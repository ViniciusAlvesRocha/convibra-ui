import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVerifierComponent } from './edit-verifier.component';

describe('EditVerifierComponent', () => {
  let component: EditVerifierComponent;
  let fixture: ComponentFixture<EditVerifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVerifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
