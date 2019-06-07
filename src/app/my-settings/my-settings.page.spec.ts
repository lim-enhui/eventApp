import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySettingsPage } from './my-settings.page';

describe('MySettingsPage', () => {
  let component: MySettingsPage;
  let fixture: ComponentFixture<MySettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
