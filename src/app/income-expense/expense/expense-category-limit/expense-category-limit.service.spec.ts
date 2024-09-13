import { TestBed } from '@angular/core/testing';

import { ExpenseCategoryLimitService } from './expense-category-limit.service';

describe('ExpenseCategoryLimitService', () => {
  let service: ExpenseCategoryLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseCategoryLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
