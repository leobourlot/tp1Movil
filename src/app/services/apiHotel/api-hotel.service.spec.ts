import { TestBed } from '@angular/core/testing';

import { ApiHotelService } from './api-hotel.service';

describe('ApiHotelService', () => {
  let service: ApiHotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
