import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipComponent } from './slip.component';

describe('SlipComponent', () => {
  let component: SlipComponent;
  let fixture: ComponentFixture<SlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
