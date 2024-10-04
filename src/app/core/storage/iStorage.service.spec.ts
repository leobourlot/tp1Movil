import { TestBed } from '@angular/core/testing';

import { IStorageService } from './iStorage.service';

describe('IStorageService', () => {
  let service: IStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
