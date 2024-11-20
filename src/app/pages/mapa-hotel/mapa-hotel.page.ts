import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { search, checkmark, add, location, arrowBackOutline } from 'ionicons/icons';
import { SearchComponent } from '../search/search.component'
import { Geolocation } from '@capacitor/geolocation';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';
import { TrasladosService } from 'src/app/services/traslados/traslados.service';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-maps',
  templateUrl: './mapa-hotel.page.html',
  styleUrls: ['./mapa-hotel.page.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonIcon]
})
export class MapaHotelPage implements OnInit {


  @ViewChild('mapHotel', { read: ElementRef }) mapRef: ElementRef<HTMLElement> | undefined;

  map: GoogleMap | undefined;
  searchMarkerId: string | undefined = undefined;
  hotel: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private toastCtl: ToastController, private hotelesService: HotelesService, private trasladosService: TrasladosService) {
    addIcons({ arrowBackOutline, search, add, location, checkmark });
  }

  ngOnInit() {
    const idHotel = this.route.snapshot.paramMap.get('idHotel');
    console.log('idHotel es: ', idHotel)
    if (idHotel) {
      this.hotelesService.obtenerHotelPorId(idHotel).then((hotelData) => {
        this.hotel = hotelData
        this.initGoogleMaps();
        console.log('Hotel cargado:', this.hotel);
      }).catch((error) => {
        console.log('Error al cargar el hotel: ', error)
      })

    }
  }

  async initGoogleMaps() {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      console.log('No hay permisos')
      const toast = await this.toastCtl.create({
        message: 'No tiene permisos suficientes para mostrar el mapa',
        color: 'danger',
        buttons: [{ role: 'cancel', text: 'OK' }]
      })
      await toast.present();
      return;
    }
    if (!this.mapRef) {
      console.log('Error, no hay mapRef')
      const toast = await this.toastCtl.create({
        message: 'Error al cargar el mapa',
        color: 'danger',
        buttons: [{ role: 'cancel', text: 'OK' }]
      })
      await toast.present();
      return;
    }
  
    
    this.map = await GoogleMap.create({
      id: 'mapHoteles',
      element: this.mapRef.nativeElement,
      apiKey: environment.googleMapsKey,
      config: {
        center: {
          lat: this.hotel.lat,
          lng: this.hotel.lng,
        },
        zoom: 16,
      },
    });
    if (this.hotel.lat && this.hotel.lng) {
      await this.map.addMarker({
        coordinate: { lat: this.hotel.lat, lng: this.hotel.lng },
        title: this.hotel.nombre,
        snippet: this.hotel.precio,
      });
      console.log('marcador añadido')
    }
    console.log("Mapa creado exitosamente:", this.map);

  }

  irAHome() {
    this.router.navigateByUrl('tabs/home')
  }

  async checkPermissions() {
    let permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted' || permissions.coarseLocation !== 'granted') {
      permissions = await Geolocation.requestPermissions(); 
    }
    return permissions.location === 'granted' && permissions.coarseLocation === 'granted'
  }

  ngOnDestroy() {
    this.map?.removeAllMapListeners();
  }
}