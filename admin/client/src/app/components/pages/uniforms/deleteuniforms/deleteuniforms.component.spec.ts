import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteuniformsComponent } from './deleteuniforms.component';

describe('DeleteuniformsComponent', () => {
  let component: DeleteuniformsComponent;
  let fixture: ComponentFixture<DeleteuniformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteuniformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteuniformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
