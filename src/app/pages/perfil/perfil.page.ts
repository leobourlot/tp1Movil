import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonBackButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonButton, IonInput, IonImg, IonAvatar, IonLabel, ToastController, IonItem, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, IonItem, IonLabel, IonAvatar, IonImg, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonIcon, ReactiveFormsModule, IonInput, NgIf]
})
export class PerfilPage {

  formDatos: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    nombre: new FormControl({ value: '', disabled: true }, Validators.required),
    apellido: new FormControl({ value: '', disabled: true }, Validators.required),
    dni: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  imageSrc: string | undefined;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {

    this.authService.usuarioActual().then((user) => {
      if (user) {

        console.log('user es: ', user)
        this.formDatos.patchValue({
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          dni: user.dni,
          foto: user.fotoPerfilUrl
        });
        this.imageSrc = user.fotoPerfilUrl
      }
    });
  }

  modificar: boolean = false;
  selectedFile: File | undefined;

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
    });

    await toast.present();
  }

  habilitarModificar() {
    this.modificar = true;
    this.formDatos.get('email')?.enable();
    this.formDatos.get('nombre')?.enable();
    this.formDatos.get('apellido')?.enable();
    this.formDatos.get('dni')?.enable();
  }

  guardarCambios() {
    this.modificar = false;
    const datosModificados = this.formDatos.value
    this.formDatos.patchValue(datosModificados)
    this.formDatos.get('email')?.disable();
    this.formDatos.get('nombre')?.disable();
    this.formDatos.get('apellido')?.disable();
    this.formDatos.get('dni')?.disable();

    const { nombre, apellido, dni } = this.formDatos.value;

    this.authService.actualizarUsuario({
      nombre: nombre,
      apellido: apellido,
      dni: dni,
      archivoImagen: this.selectedFile,
    })
  }
  
  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    this.imageSrc = image.dataUrl;

    if (image.dataUrl) {
      const blob = await this.dataUrlToBlob(image.dataUrl);

      const file = new File([blob], 'perfil.jpg', { type: 'image/jpeg' });

      this.selectedFile = file;
      console.log('selectedFile es: ', this.selectedFile)
    }
  }

  async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl);
    return await res.blob();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.presentToast('Sesión cerrada.', 'secondary')
    this.router.navigateByUrl('/login')
  }


  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string; 
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

}