import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletemenuComponent } from './deletemenu.component';

describe('DeletemenuComponent', () => {
  let component: DeletemenuComponent;
  let fixture: ComponentFixture<DeletemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
