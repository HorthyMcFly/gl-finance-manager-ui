import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryLimitComponent } from './expense-category-limit.component';

describe('ExpenseCategoryLimitComponent', () => {
  let component: ExpenseCategoryLimitComponent;
  let fixture: ComponentFixture<ExpenseCategoryLimitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExpenseCategoryLimitComponent]
    });
    fixture = TestBed.createComponent(ExpenseCategoryLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
