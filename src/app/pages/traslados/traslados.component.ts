import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.scss'],
})
export class TrasladosComponent  implements OnInit {

  // @Input() hotel: { lat: number; lng: number; nombre: string } | null = null;
  // @Input() aeropuerto: { lat: number; lng: number; nombre: string } | null = null;

  // // aeropuerto = { lat: -31.394, lng: -58.020 }; // Coordenadas del aeropuerto
  // distancia: number | null = null;
  // costo: number | null = null;

  ngOnInit() {
    // if (this.hotel) {
      // this.calcularDistanciaConGoogle();
    // }
  }

  // calcularDistanciaConGoogle() {
  //   if (!this.hotel) return;

  //   const service = new google.maps.DistanceMatrixService();

  //   const origen = new google.maps.LatLng(this.aeropuerto.lat, this.aeropuerto.lng);
  //   const destino = new google.maps.LatLng(this.hotel.lat, this.hotel.lng);

  //   service.getDistanceMatrix(
  //     {
  //       origins: [origen],
  //       destinations: [destino],
  //       travelMode: google.maps.TravelMode.DRIVING, // Modo de viaje
  //       unitSystem: google.maps.UnitSystem.METRIC, // Usar sistema métrico
  //     },
  //     (response: any, status: string) => {
  //       if (status === google.maps.DistanceMatrixStatus.OK) {
  //         const resultados = response.rows[0].elements[0];
  //         this.distancia = resultados.distance.value / 1000; // Convertir metros a km
  //         this.costo = this.distancia * 1000; // Calcular costo
  //       } else {
  //         console.error('Error en DistanceMatrixService:', status);
  //       }
  //     }
  //   );
  // }
}