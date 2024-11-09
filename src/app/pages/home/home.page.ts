import { Component, Optional } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonText, IonTitle, IonToolbar, Platform, IonRouterOutlet, ToastController, IonItem, IonImg, IonGrid, IonRow, IonCol, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardHeader, IonCardTitle, IonCard, IonCol, IonRow, IonGrid, IonImg, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonText, NgIf]
})
export class HomePage {

  esHotel: boolean | undefined;

  constructor(private router: Router, private platform: Platform, private authService: AuthService, private toastController: ToastController,
    @Optional() private routerOutlet?: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }

  ngOnInit(){
    this.authService.usuarioActual().then((user) => {
      if(user){
        const tipoUsuario = user.tipoUsuario

        if(tipoUsuario === "1"){
          this.esHotel = true
        } else{
          this.esHotel = false
        }

      }
    })
    
  }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
    });
    
    await toast.present();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.presentToast('Sesión cerrada.', 'secondary')
    this.router.navigateByUrl('/login')
  }

  irANuevoHotel() {
    this.router.navigateByUrl('nuevoHotel')
  }
  
  irAVerMapa() {
    this.router.navigateByUrl('maps')
  }

}
