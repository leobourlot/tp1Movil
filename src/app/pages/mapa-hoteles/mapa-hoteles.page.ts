import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ToastController, ViewDidEnter } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { search, checkmark, add, location, arrowBackOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';
import { TrasladosService } from 'src/app/services/traslados/traslados.service';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-maps',
  templateUrl: './mapa-hoteles.page.html',
  styleUrls: ['./mapa-hoteles.page.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton]
})
export class MapaHotelesPage implements ViewDidEnter {


  @ViewChild('mapHoteles', { read: ElementRef }) mapRef: ElementRef<HTMLElement> | undefined;

  map: GoogleMap | undefined;
  searchMarkerId: string | undefined = undefined;
  hoteles: any[] = [];
  traslados: any[] = [];


  constructor(private router: Router, private toastCtl: ToastController, private hotelesService: HotelesService, private trasladosService: TrasladosService) {
    addIcons({ arrowBackOutline, search, add, location, checkmark });
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter llamado');
    this.hoteles = await this.hotelesService.cargarHoteles();
    this.traslados = await this.trasladosService.cargarTraslados();
    this.initGoogleMaps();
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
          lat: -31.389824,
          lng: -58.016186,
        },
        zoom: 16,
      },
    });
    for (const hotel of this.hoteles) {
      console.log('hoteles es: ', this.hoteles)
      if (hotel.lat && hotel.lng) {
        await this.map.addMarker({
          coordinate: { lat: hotel.lat, lng: hotel.lng },
          title: hotel.nombre,
          snippet: hotel.precio,
        });
        console.log('marcador añadido')
      }
    }
    try {
      for (const traslado of this.traslados) {
        console.log('traslados es: ', this.traslados)
        if (traslado.lat && traslado.lng) {
          await this.map.addMarker({
            coordinate: { lat: traslado.lat, lng: traslado.lng },
            title: traslado.nombre,
          });
          console.log('marcador añadido')
        }
      }
    } catch (error) {
      console.log('error al cargar traslados', error)
    };
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