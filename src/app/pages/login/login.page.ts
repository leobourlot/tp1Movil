import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonInputPasswordToggle, IonBackButton, IonIcon, IonToast, ToastController, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonIcon, IonInput, IonInputPasswordToggle, ReactiveFormsModule, IonToast],
})
export class LoginPage {

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
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

  async onSubmit() {

    if (this.formLogin.valid) {
      const values = this.formLogin.value;
      await this.authService.loginEmail(values)
        .then(() => {
          this.presentToast('Inicio de sesión exitoso.', 'success')
          this.router.navigateByUrl('/tabs/home')
        })
        .catch((error) => {
          console.error('Error al iniciar sesión:', error);
          this.presentToast('Usuario y/o contraseña incorrectos.', 'danger')
        })
    }
  }

  irARegistro() {
    this.router.navigateByUrl('/registro')
  }


}
