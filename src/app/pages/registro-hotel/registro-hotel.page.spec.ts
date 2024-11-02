import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroHotelPage } from './registro-hotel.page';

describe('RegistroHotelPage', () => {
  let component: RegistroHotelPage;
  let fixture: ComponentFixture<RegistroHotelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
