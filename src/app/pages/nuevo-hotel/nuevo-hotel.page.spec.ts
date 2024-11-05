import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoHotelPage } from './nuevo-hotel.page';

describe('NuevoHotelPage', () => {
  let component: NuevoHotelPage;
  let fixture: ComponentFixture<NuevoHotelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
