import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonIcon, IonButton, IonInput, IonInputPasswordToggle, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonInputPasswordToggle, IonIcon, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, ReactiveFormsModule],})
export class RegistroPage {

  formRegistro: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    nombreUsuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private toastController: ToastController) { }

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
    const email = this.formRegistro.value.email;
    const usuario = this.formRegistro.value.nombreUsuario;
    const dni = this.formRegistro.value.dni;

    
    if (email === 'leo_bourlot@hotmail.com') {
      console.log('El mail utilizado ya tiene una cuenta registrada.');
      this.presentToast('El mail utilizado ya tiene una cuenta registrada.', 'danger')
    
    } else if (dni === '34646209') {
      console.log('Ya existe un usuario con el DNI ingresado.');
      this.presentToast('Ya existe un usuario con el DNI ingresado.', 'danger')
    
    } else if (usuario === 'leonardo') {
      console.log('Ya existe un usuario con el usuario ingresado.');
      this.presentToast('Ya existe un usuario con el usuario ingresado.', 'danger')
    
    } else{
      console.log('Usuario registrado correctamente.')
      this.presentToast('Usuario registrado correctamente.', 'success')
      this.router.navigateByUrl('/login');
    }

  }

}
