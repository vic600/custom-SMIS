import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdituniformsComponent } from './edituniforms.component';

describe('EdituniformsComponent', () => {
  let component: EdituniformsComponent;
  let fixture: ComponentFixture<EdituniformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdituniformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdituniformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
