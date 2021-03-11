import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmpressComponent } from './registro-empress.component';

describe('RegistroEmpressComponent', () => {
  let component: RegistroEmpressComponent;
  let fixture: ComponentFixture<RegistroEmpressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEmpressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEmpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
