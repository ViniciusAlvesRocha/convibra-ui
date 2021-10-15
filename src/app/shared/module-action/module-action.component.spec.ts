import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleActionComponent } from './module-action.component';

describe('ModuleActionComponent', () => {
  let component: ModuleActionComponent;
  let fixture: ComponentFixture<ModuleActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
