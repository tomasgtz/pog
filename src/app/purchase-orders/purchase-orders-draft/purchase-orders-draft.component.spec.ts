import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersDraftComponent } from './purchase-orders-draft.component';

describe('PurchaseOrdersDraftComponent', () => {
  let component: PurchaseOrdersDraftComponent;
  let fixture: ComponentFixture<PurchaseOrdersDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrdersDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
