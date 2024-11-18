import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';
import { Swiper } from 'swiper';
import { Hotel } from 'src/app/interfaces';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-pagina-hotel',
  templateUrl: './pagina-hotel.page.html',
  styleUrls: ['./pagina-hotel.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PaginaHotelPage implements OnInit {

  hotel: any = null;
  @ViewChild('swiper')
  swiper?: Swiper;

  constructor(private route: ActivatedRoute,private hotelesService: HotelesService, private router: Router) { }

  ngOnInit() {
    const idHotel = this.route.snapshot.paramMap.get('idHotel');
    console.log('idHotel es: ', idHotel)
    if (idHotel) {
      this.hotelesService.obtenerHotelPorId(idHotel).then((hotelData) => {
        this.hotel = hotelData
        console.log('Hotel cargado:', this.hotel);
      }).catch((error) => {
        console.log('Error al cargar el hotel: ', error)
      })

    }
  }

  irAMapaHotel(hotel: any){
    console.log('Redireccion llamada. Hotel es: ', hotel)
    this.router.navigateByUrl(`mapaHotel/${hotel.id}`)
  }
}
