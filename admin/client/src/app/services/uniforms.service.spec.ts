import { TestBed, inject } from '@angular/core/testing';

import { UniformsService } from './uniforms.service';

describe('UniformsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UniformsService]
    });
  });

  it('should be created', inject([UniformsService], (service: UniformsService) => {
    expect(service).toBeTruthy();
  }));
});
