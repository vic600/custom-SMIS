import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepayComponent } from './repay.component';

describe('RepayComponent', () => {
  let component: RepayComponent;
  let fixture: ComponentFixture<RepayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
