import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonBackButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonButton, IonInput, IonImg, IonAvatar, IonLabel, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonLabel, IonAvatar, IonImg, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonIcon, ReactiveFormsModule, IonInput, NgIf]
})
export class PerfilPage {

  formDatos: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    nombre: new FormControl({ value: '', disabled: true }, Validators.required),
    apellido: new FormControl({ value: '', disabled: true }, Validators.required),
    dni: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
    
    this.authService.usuarioActual().then((user) => {
      if (user) {
        
        console.log('user es: ', user)
        this.formDatos.patchValue({
          email: user.email,
          nombre: user.nombre, 
          apellido: user.apellido,
          dni: user.dni
        });
      }
    });
  }

  modificar: boolean = false;

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
    });

    await toast.present();
  }
  
  habilitarModificar(){
    this.modificar = true;
    this.formDatos.get('email')?.enable();
    this.formDatos.get('nombre')?.enable();
    this.formDatos.get('apellido')?.enable();
    this.formDatos.get('dni')?.enable();
  }

  guardarCambios(){
    this.modificar = false;

    const datosModificados = this.formDatos.value

    this.formDatos.patchValue(datosModificados)

    this.formDatos.get('email')?.disable();
    this.formDatos.get('nombre')?.disable();
    this.formDatos.get('apellido')?.disable();
    this.formDatos.get('dni')?.disable();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.presentToast('Sesión cerrada.', 'secondary')
    this.router.navigateByUrl('/login')
  }

}

// {
//   "displayName": null,
//   "email": "leobourlot@gmail.com",
//   "emailVerified": false,
//   "isAnonymous": false,
//   "metadata": {
//       "creationTime": 1728511122000,
//       "lastSignInTime": 1728521208000
//   },
//   "phoneNumber": null,
//   "photoUrl": null,
//   "providerData": [
//       {
//           "displayName": null,
//           "email": "leobourlot@gmail.com",
//           "phoneNumber": null,
//           "photoUrl": null,
//           "providerId": "password",
//           "uid": "leobourlot@gmail.com"
//       }
//   ],
//   "providerId": "firebase",
//   "tenantId": null,
//   "uid": "K2owMwwMAwM2QUQiPsFk4mLq6Es1",
//   "dni": "34646209",
//   "nombre": "leonardo",
//   "apellido": "bourlot"
// }