import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';
import { Swiper } from 'swiper';
import { TrasladosService } from 'src/app/services/traslados/traslados.service';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-pagina-hotel',
  templateUrl: './pagina-hotel.page.html',
  styleUrls: ['./pagina-hotel.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon]
})
export class PaginaHotelPage implements OnInit {

  hotel: any = null;
  @ViewChild('swiper')
  swiper?: Swiper;
  traslados: any[] | undefined;
  aeropuerto: { lat: number; lng: number } | undefined;
  terminal: { lat: number; lng: number } | undefined;
  distanciaAeropuerto: number | undefined; 
  distanciaTerminal: number | undefined; 
  costoAeropuerto: number | undefined;
  costoTerminal: number | undefined;

  constructor(private route: ActivatedRoute, private hotelesService: HotelesService, private router: Router, private trasladosServices: TrasladosService) { }

  async ngOnInit() {
    const idHotel = this.route.snapshot.paramMap.get('idHotel');
    console.log('idHotel es: ', idHotel)
    if (idHotel) {
      this.hotelesService.obtenerHotelPorId(idHotel).then((hotelData) => {
        this.hotel = hotelData
        console.log('Hotel cargado:', this.hotel);
      }).catch((error) => {
        console.log('Error al cargar el hotel: ', error)
      })
      this.traslados = await this.trasladosServices.cargarTraslados()
      console.log('traslados es: ', this.traslados)
      this.aeropuerto = this.traslados[0]
      this.terminal = this.traslados[1]
      this.calcularDistanciaConGoogle();
    }

  }

  irAMapaHotel(hotel: any) {
    console.log('Redireccion llamada. Hotel es: ', hotel)
    this.router.navigateByUrl(`mapaHotel/${hotel.id}`)
  }

  calcularDistanciaConGoogle() {
    if (!this.hotel || !this.aeropuerto || !this.terminal) {
      console.error('Faltan datos del hotel, del aeropuerto o de la terminal para calcular la distancia.');
      return;
    }

    if (typeof google === 'undefined') {
      console.error("La biblioteca de Google Maps no está disponible.");
      return;
    }

    console.log('calcularDistancia llamado')

    const service = new google.maps.DistanceMatrixService();
    console.log('service: ', service)

    const origenAeropuerto = new google.maps.LatLng(this.aeropuerto.lat, this.aeropuerto.lng);
    const origenTerminal = new google.maps.LatLng(this.terminal.lat, this.terminal.lng);
    const destino = new google.maps.LatLng(this.hotel.lat, this.hotel.lng);

    const origenes = [origenAeropuerto, origenTerminal]

    service.getDistanceMatrix(
      {
        origins: [origenAeropuerto],
        destinations: [destino],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC, 
      },
      (response: any, status: string) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const resultados = response.rows[0].elements[0];
          console.log('resultados: ', resultados)
          this.distanciaAeropuerto = resultados.distance.value / 1000; 
          this.costoAeropuerto = this.distanciaAeropuerto * 1000; 
          console.log(`Distancia: ${this.distanciaAeropuerto} km, Costo estimado: $${this.costoAeropuerto}`);
        } else {
          console.error('Error en DistanceMatrixService:', status);
        }
      }
    );
    
    service.getDistanceMatrix(
      {
        origins: [origenTerminal],
        destinations: [destino],
        travelMode: google.maps.TravelMode.DRIVING, 
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const resultados = response.rows[0].elements[0];
          console.log('resultados: ', resultados)
          this.distanciaTerminal = resultados.distance.value / 1000;
          this.costoTerminal = this.distanciaTerminal * 1000; 
          console.log(`Distancia: ${this.distanciaTerminal} km, Costo estimado: $${this.costoTerminal}`);
        } else {
          console.error('Error en DistanceMatrixService:', status);
        }
      }
    );
  }
}
