import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConfigSettingComponent } from './api-config-setting.component';

describe('ApiConfigSettingComponent', () => {
  let component: ApiConfigSettingComponent;
  let fixture: ComponentFixture<ApiConfigSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiConfigSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConfigSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
