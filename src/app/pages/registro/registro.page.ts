import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonIcon, IonButton, IonInput, IonInputPasswordToggle, ToastController, IonLoading } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  providers: [],
  imports: [IonButton, IonInput, IonInputPasswordToggle, IonIcon, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, ReactiveFormsModule, IonLoading],
})
export class RegistroPage {

  tipo = "1";

  formRegistro: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private toastController: ToastController, private authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['tipo']) {
      this.tipo = navigation.extras.state['tipo'];
      console.log('Tipo recibido:', this.tipo); 
    }
  }

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
    if (this.formRegistro.valid) {
      const { email, clave, nombre, apellido, dni } = this.formRegistro.value;

      this.authService.registroEmail({
        email: email,
        password: clave,
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        tipoUsuario: this.tipo
      })
        .then(() => {
          this.presentToast('Usuario registrado correctamente.', 'success');
          this.notificacionRegistro()
          this.router.navigateByUrl('/login');
        })
        .catch((error) => {
          console.error('Error al registrar:', error);
          this.presentToast('Error al registrar el usuario.', 'danger');
        });
    }
  }

  async notificacionRegistro() {
    const hasPermissions = await LocalNotifications.checkPermissions();
    if (hasPermissions.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
    if (this.tipo === '1') {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Bienvenido a ConcorSuite',
            body: 'Esperamos que muchos puedan disfrutar de su hotel. Gracias por confiar en nosotros.',
            id: 1,

            schedule: { at: new Date(Date.now() + 1000 * 3) }
          }
        ]
      });
    } else if (this.tipo === '2') {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Bienvenido a ConcorSuite',
            body: 'Esperamos que disfrute de su estadía en Concordia. Gracias por confiar en nosotros.',
            id: 2,

            schedule: { at: new Date(Date.now() + 1000 * 3) }
          }
        ]
      });
    }
  }
}
