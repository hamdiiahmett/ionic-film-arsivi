import { TestBed } from '@angular/core/testing';

import { Fire } from './fire';

describe('Fire', () => {
  let service: Fire;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fire);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
