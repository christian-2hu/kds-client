import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDownComponent } from './count-down.component';

describe('CountDownComponent', () => {
  let component: CountDownComponent;
  let fixture: ComponentFixture<CountDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountDownComponent]
    });
    fixture = TestBed.createComponent(CountDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
