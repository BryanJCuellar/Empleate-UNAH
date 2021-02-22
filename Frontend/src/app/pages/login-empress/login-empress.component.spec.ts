import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEmpressComponent } from './login-empress.component';

describe('LoginEmpressComponent', () => {
  let component: LoginEmpressComponent;
  let fixture: ComponentFixture<LoginEmpressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginEmpressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEmpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
