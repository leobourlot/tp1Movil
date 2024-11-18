import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaHotelPage } from './mapa-hotel.page';

describe('MapaHotelPage', () => {
  let component: MapaHotelPage;
  let fixture: ComponentFixture<MapaHotelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
