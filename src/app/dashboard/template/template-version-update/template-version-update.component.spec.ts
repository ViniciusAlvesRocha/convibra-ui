import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateVersionUpdateComponent } from './template-version-update.component';

describe('TemplateVersionUpdateComponent', () => {
  let component: TemplateVersionUpdateComponent;
  let fixture: ComponentFixture<TemplateVersionUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateVersionUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateVersionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
