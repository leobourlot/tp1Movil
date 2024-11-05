import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButton, IonLoading, IonInput, IonInputPasswordToggle, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-nuevo-hotel',
  templateUrl: './nuevo-hotel.page.html',
  styleUrls: ['./nuevo-hotel.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonLoading, IonButton, IonInput, IonInputPasswordToggle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class NuevoHotelPage {

  formNuevoHotel: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required])
  });

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
      const { email, clave, nombre, apellido, dni } = this.formNuevoHotel.value;

      this.authService.registroEmailHotel({
        email: email,
        password: clave,
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        tipoUsuario: "1"
      })
        .then(() => {
          this.presentToast('Usuario registrado correctamente.', 'success');
          this.router.navigateByUrl('/login');
        })
        .catch((error) => {
          console.error('Error al registrar:', error);
          this.presentToast('Error al registrar el usuario.', 'danger');
        });
    }
  }
}