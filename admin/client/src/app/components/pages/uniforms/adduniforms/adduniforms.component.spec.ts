import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdduniformsComponent } from './adduniforms.component';

describe('AdduniformsComponent', () => {
  let component: AdduniformsComponent;
  let fixture: ComponentFixture<AdduniformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdduniformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdduniformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
