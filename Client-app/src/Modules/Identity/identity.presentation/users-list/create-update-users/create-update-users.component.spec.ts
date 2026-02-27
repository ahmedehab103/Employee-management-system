/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateUpdateAdminsComponent } from './create-update-users.component';

describe('CreateUpdateAdminsComponent', () => {
  let component: CreateUpdateAdminsComponent;
  let fixture: ComponentFixture<CreateUpdateAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateAdminsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
