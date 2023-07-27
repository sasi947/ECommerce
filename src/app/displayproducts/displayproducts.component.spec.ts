import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayproductsComponent } from './displayproducts.component';

describe('DisplayproductsComponent', () => {
  let component: DisplayproductsComponent;
  let fixture: ComponentFixture<DisplayproductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayproductsComponent]
    });
    fixture = TestBed.createComponent(DisplayproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
