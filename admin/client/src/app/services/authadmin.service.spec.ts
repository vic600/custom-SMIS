import { TestBed, inject } from '@angular/core/testing';

import { AuthadminService } from './authadmin.service';

describe('AuthadminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthadminService]
    });
  });

  it('should be created', inject([AuthadminService], (service: AuthadminService) => {
    expect(service).toBeTruthy();
  }));
});
