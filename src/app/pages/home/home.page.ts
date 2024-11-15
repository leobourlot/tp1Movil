import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Optional, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonText, IonTitle, IonToolbar, Platform, IonRouterOutlet, ToastController, IonItem, IonImg, IonGrid, IonRow, IonCol, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';
import { Swiper } from 'swiper';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardHeader, IonCardTitle, IonCard, IonCol, IonRow, IonGrid, IonImg, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonText, NgIf]
})
export class HomePage {
  hoteles: any[] = [];
  esHotel: boolean | undefined;
  @ViewChild('swiper')
  swiper?: Swiper;


  hotelesFicticios = [
    {
      nombre: 'Hotel A',
      direccion: '123 Main St',
      fotos: [
        'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        'https://images.unsplash.com/photo-1488229297570-58520851e868'
      ]
    },
    {
      nombre: 'Hotel B',
      direccion: '456 Broadway Ave',
      fotos: [
        'https://ionicframework.com/docs/img/demos/card-media.png',
        'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
      ]
    },
    {
      nombre: 'Hotel C',
      direccion: '789 Ocean Blvd',
      fotos: [
        'https://images.unsplash.com/photo-1488229297570-58520851e868'
      ]
    }
  ];

  constructor(private router: Router, private platform: Platform, private hotelesService: HotelesService, private authService: AuthService, private toastController: ToastController,
    @Optional() private routerOutlet?: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }

  async ngOnInit(){
    this.hoteles = await this.hotelesService.getHoteles();
    console.log(this.hoteles);
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
