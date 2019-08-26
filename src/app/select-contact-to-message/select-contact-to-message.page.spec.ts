import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContactToMessagePage } from './select-contact-to-message.page';

describe('SelectContactToMessagePage', () => {
  let component: SelectContactToMessagePage;
  let fixture: ComponentFixture<SelectContactToMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectContactToMessagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContactToMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
