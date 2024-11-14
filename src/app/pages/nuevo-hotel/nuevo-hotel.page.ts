import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButton, IonLoading, IonInput, IonInputPasswordToggle, IonBackButton, IonIcon, IonModal, IonButtons, IonItem, ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components'
import { AuthService } from 'src/app/services/auth/auth.service';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { MapsPage } from '../maps/maps.page';
import { SearchComponent } from '../search/search.component';
import { Point } from 'src/app/interfaces';


@Component({
  selector: 'app-nuevo-hotel',
  templateUrl: './nuevo-hotel.page.html',
  styleUrls: ['./nuevo-hotel.page.scss'],
  standalone: true,
  imports: [IonItem, IonButtons, IonModal, IonIcon, IonBackButton, IonLoading, IonButton, IonInput, IonInputPasswordToggle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, MapsPage, SearchComponent, IonModal]
})
export class NuevoHotelPage {

  formNuevoHotel: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    lat: new FormControl(''),
    lng: new FormControl('')
  });

  coordenadasListas: boolean = false

  @ViewChild(MapsPage) mapsComponent: MapsPage | undefined;

  @ViewChild(IonModal) modal: IonModal | undefined;
  coordenadas: Point | undefined;

  constructor(private router: Router, private toastController: ToastController, private authService: AuthService, private modalCtrl: ModalController) { }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color,
    });

    await toast.present();
  }

  onSubmit() {
    if (this.formNuevoHotel.valid) {
      const { nombre, direccion, lat, lng } = this.formNuevoHotel.value;

      console.log('los valores son: ', nombre, direccion, lat, lng)

      this.authService.registroHotel({
        nombre: nombre,
        direccion: direccion,
        lat: lat,
        lng: lng
      })
        .then(() => {
          this.presentToast('Hotel registrado correctamente.', 'success');
          this.router.navigateByUrl('/tabs/home');
        })
        .catch((error) => {
          console.error('Error al registrar:', error);
          this.presentToast('Error al registrar el hotel.', 'danger');
        });
    }
  }

  guardarCoordenadas(coords: Point) {
    console.log('se llamó a guardarCoordenadas')
    this.formNuevoHotel.patchValue({ lat: coords.lat, lng: coords.lng });
    console.log('formulario es: ', this.formNuevoHotel)
  }

  // cancel() {
  //   this.modal?.dismiss(null, 'cancel');
  // }

  // confirm() {
  //   this.modal?.dismiss(this.coordenadas, 'confirm');
  // }

  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<Point>>;
  //   if (ev.detail.role === 'confirm' && ev.detail.data) {
  //     // Asegura que el valor sea un objeto Point antes de asignarlo
  //     const coords = ev.detail.data;
  //     if (typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
  //       this.coordenadas = coords;
  //     } else {
  //       console.error('Error: las coordenadas no son del tipo esperado.');
  //     }
  //   }
  // }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: MapsPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.message = `Hello, ${data}!`;
    }
  }
}