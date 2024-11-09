import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { search, checkmark } from 'ionicons/icons';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonIcon]
})
export class MapsPage implements OnInit {

  // @ts-ignore
  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  // @ts-ignore
  map: GoogleMap;
  showSearch: boolean = false;
  modoPoligono: boolean = false;


  constructor(private router: Router) {
      addIcons({checkmark,search}); }

  ngOnInit() {
    addIcons({search})
  }

  ionViewDidEnter() {
    this.initGoogleMaps();
  }

  async initGoogleMaps() {
    if (!this.mapRef?.nativeElement) {
      console.error("Error: mapRef no definido.");
      return;
    }
    try {

      this.map = await GoogleMap.create({
        id: 'map',
        element: this.mapRef.nativeElement,
        apiKey: environment.googleMapsKey,
        config: {
          center: {
            lat: -31.23,
            lng: -58.03,
          },
          zoom: 8,
        },
      })
      console.log("Mapa creado exitosamente:", this.map);
    } catch (error) {
      console.error("Error creando el mapa:", error);
    }

  }

  irAHome() {
    this.router.navigateByUrl('tabs/home')
  }

  toggleSearchBar() {
    this.showSearch = !this.showSearch;
  }
}