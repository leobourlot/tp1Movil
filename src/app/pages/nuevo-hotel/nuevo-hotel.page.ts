import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButton, IonLoading, IonInput, IonInputPasswordToggle, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { MapsPage } from '../maps/maps.page';


@Component({
  selector: 'app-nuevo-hotel',
  templateUrl: './nuevo-hotel.page.html',
  styleUrls: ['./nuevo-hotel.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonLoading, IonButton, IonInput, IonInputPasswordToggle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, MapsPage]
})
export class NuevoHotelPage {

  formNuevoHotel: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
  });

  @ViewChild(MapsPage) mapsComponent: MapsPage | undefined;

  constructor(private router: Router, private toastController: ToastController, private authService: AuthService) { }

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
      const { nombre, direccion } = this.formNuevoHotel.value;

      this.authService.registroHotel({
        nombre: nombre,
        direccion: direccion,
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

  onFocusDireccion() {
    if (this.mapsComponent) {
      this.mapsComponent.toggleSearchBar();
    }
  }
}