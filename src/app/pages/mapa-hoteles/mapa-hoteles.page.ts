import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonBackButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController, ToastController, ViewDidEnter, ViewWillEnter } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { search, checkmark, add, location, arrowBackOutline } from 'ionicons/icons';
import { SearchComponent } from '../search/search.component'
import { Point } from 'src/app/interfaces';
import { Geolocation } from '@capacitor/geolocation';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-maps',
  templateUrl: './mapa-hoteles.page.html',
  styleUrls: ['./mapa-hoteles.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonIcon, SearchComponent]
})
export class MapaHotelesPage implements ViewDidEnter {


  @ViewChild('mapHoteles', { read: ElementRef }) mapRef: ElementRef<HTMLElement> | undefined;

  map: GoogleMap | undefined;
  searchMarkerId: string | undefined = undefined;
  hoteles: any[] = [];


  constructor(private router: Router, private toastCtl: ToastController, private hotelesService: HotelesService) {
    addIcons({ arrowBackOutline, search, add, location, checkmark });
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter llamado');

    // await new Promise(resolve => setTimeout(resolve, 200));
    this.hoteles = await this.hotelesService.cargarHoteles();
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
        zoom: 17,
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
    console.log("Mapa creado exitosamente:", this.map);
  }

  irAHome() {
    this.router.navigateByUrl('tabs/home')
  }

  async checkPermissions() {
    let permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted' || permissions.coarseLocation !== 'granted') {
      permissions = await Geolocation.requestPermissions(); // Solicitar permisos si no están concedidos
    }
    return permissions.location === 'granted' && permissions.coarseLocation === 'granted'
  }
  
  ngOnDestroy() {
    this.map?.removeAllMapListeners();
  }
}