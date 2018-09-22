import { TestBed, inject } from '@angular/core/testing';

import { BillsService } from './bills.service';

describe('BillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillsService]
    });
  });

  it('should be created', inject([BillsService], (service: BillsService) => {
    expect(service).toBeTruthy();
  }));
});
