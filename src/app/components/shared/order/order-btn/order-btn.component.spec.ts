import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBtnComponent } from './order-btn.component';

describe('OrderBtnComponent', () => {
  let component: OrderBtnComponent;
  let fixture: ComponentFixture<OrderBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderBtnComponent]
    });
    fixture = TestBed.createComponent(OrderBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
