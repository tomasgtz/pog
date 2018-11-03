import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersSentComponent } from './purchase-orders-sent.component';

describe('PurchaseOrdersSentComponent', () => {
  let component: PurchaseOrdersSentComponent;
  let fixture: ComponentFixture<PurchaseOrdersSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrdersSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
