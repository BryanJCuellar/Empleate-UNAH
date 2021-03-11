import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEmpresComponent } from './profile-empres.component';

describe('ProfileEmpresComponent', () => {
  let component: ProfileEmpresComponent;
  let fixture: ComponentFixture<ProfileEmpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileEmpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEmpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



