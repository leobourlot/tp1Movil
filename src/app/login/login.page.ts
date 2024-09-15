import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonInputPasswordToggle, IonBackButton, IonIcon, IonToast, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonIcon, IonInput, IonInputPasswordToggle, ReactiveFormsModule, IonToast],
})
export class LoginPage {
  
  formLogin: FormGroup = new FormGroup({
    nombreUsuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private toastController: ToastController) {}

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
    const usuario = this.formLogin.value.nombreUsuario;
    const clave = this.formLogin.value.clave;

    // Verificar si los valores ingresados coinciden con los predefinidos
    if (usuario === 'leonardo' && clave === '1234') {
      console.log('Inicio de sesión exitoso');
      this.presentToast('Inicio de sesión exitoso.', 'success')
      this.router.navigateByUrl('/tabs/home')
      // Aquí puedes redirigir al usuario a otra página o realizar otras acciones
    } else {
      this.presentToast('Usuario y/o contraseña incorrectos.', 'danger')
      console.log('Credenciales incorrectas');
      // Mostrar un mensaje de error al usuario
    }
  }

  irARegistro(){
    this.router.navigateByUrl('/registro')
  }

  
}
