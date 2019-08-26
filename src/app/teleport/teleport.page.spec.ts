import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleportPage } from './teleport.page';

describe('TeleportPage', () => {
  let component: TeleportPage;
  let fixture: ComponentFixture<TeleportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
