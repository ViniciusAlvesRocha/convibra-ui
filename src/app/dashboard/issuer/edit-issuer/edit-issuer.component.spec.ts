import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssuerComponent } from './edit-issuer.component';

describe('EditIssuerComponent', () => {
  let component: EditIssuerComponent;
  let fixture: ComponentFixture<EditIssuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIssuerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
