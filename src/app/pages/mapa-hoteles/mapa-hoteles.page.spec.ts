import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaHotelesPage } from './mapa-hoteles.page';

describe('MapaHotelesPage', () => {
  let component: MapaHotelesPage;
  let fixture: ComponentFixture<MapaHotelesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaHotelesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
