import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaHotelPage } from './pagina-hotel.page';

describe('PaginaHotelPage', () => {
  let component: PaginaHotelPage;
  let fixture: ComponentFixture<PaginaHotelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
