import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateVersionHistoryComponent } from './template-version-history.component';

describe('TemplateVersionHistoryComponent', () => {
  let component: TemplateVersionHistoryComponent;
  let fixture: ComponentFixture<TemplateVersionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateVersionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateVersionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
