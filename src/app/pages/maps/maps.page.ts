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

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonIcon, SearchComponent]
})
export class MapsPage implements ViewDidEnter {


  @ViewChild('map', { read: ElementRef }) mapRef: ElementRef<HTMLElement> | undefined;

  map: GoogleMap | undefined;
  showSearch: boolean = false;
  searchMarkerId: string | undefined = undefined;
  ubicacionCorrecta: boolean = false


  constructor(private router: Router, private toastCtl: ToastController, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    addIcons({ arrowBackOutline, search, add, location, checkmark });
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter llamado');

    // await new Promise(resolve => setTimeout(resolve, 200));
    this.initGoogleMaps();
  }


  async initGoogleMaps() {
    // await new Promise(resolve => setTimeout(resolve, 100));
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
      id: 'map',
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
  
  toggleSearchBar() {
    this.showSearch = !this.showSearch;
  }

  async onNewCoordinates(coords: Point) {
    console.log('Received coordinates:', coords); // Verificar que coords sea de tipo Point
    this.map?.setCamera({
      coordinate: { lat: coords.lat, lng: coords.lng },
      zoom: 18
    });
    this.searchMarkerId = await this.map?.addMarker({
      coordinate: { lat: coords.lat, lng: coords.lng },
    });
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Es correcta la ubicación ingresada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          },
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['/nuevoHotel'], {
              queryParams: { lat: coords.lat, lng: coords.lng }
            });
          },
        },
      ],
    });

    await alert.present();


  }

  ngOnDestroy() {
    this.map?.removeAllMapListeners();
  }
}