import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceSettingComponent } from './instance-setting.component';

describe('InstanceSettingComponent', () => {
  let component: InstanceSettingComponent;
  let fixture: ComponentFixture<InstanceSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
