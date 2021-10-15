import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCsvImportComponent } from './add-csv-import.component';

describe('AddCsvImportComponent', () => {
  let component: AddCsvImportComponent;
  let fixture: ComponentFixture<AddCsvImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCsvImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCsvImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
