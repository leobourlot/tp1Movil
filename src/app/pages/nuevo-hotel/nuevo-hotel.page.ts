import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButton, IonLoading, IonInput, IonInputPasswordToggle, IonBackButton, IonIcon, IonButtons, IonItem, IonTextarea } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsPage } from '../maps/maps.page';
import { SearchComponent } from '../search/search.component';
import { Point } from 'src/app/interfaces';
import { HotelesService } from 'src/app/services/hoteles/hoteles.service';
import { LocalNotifications } from '@capacitor/local-notifications';


@Component({
  selector: 'app-nuevo-hotel',
  templateUrl: './nuevo-hotel.page.html',
  styleUrls: ['./nuevo-hotel.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonLoading, IonButton, IonInput, IonTextarea, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class NuevoHotelPage {

  formNuevoHotel: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    lat: new FormControl(''),
    lng: new FormControl(''),
  });

  coordenadasListas: boolean = false

  @ViewChild(MapsPage) mapsComponent: MapsPage | undefined;

  coordenadas: Point | undefined;
  images: string[] = [];
  files: File[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private toastController: ToastController, private hotelesService: HotelesService) { }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      if (params['lat'] && params['lng']) {
        this.formNuevoHotel.patchValue({
          lat: +params['lat'],
          lng: +params['lng']
        });
        this.coordenadasListas = !this.coordenadasListas
        console.log('Coordenadas recibidas:', params['lat'], params['lng']);
        console.log('formulario es: ', this.formNuevoHotel)
      } else {
        console.log('No hay coordenadas aún');
      }
    });
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
    if (this.formNuevoHotel.valid) {
      const { nombre, direccion, descripcion, lat, lng, precio, telefono } = this.formNuevoHotel.value;

      console.log('los valores son: ', nombre, direccion, lat, lng)

      this.hotelesService.guardarDatosHotel({
        nombre: nombre,
        direccion: direccion,
        descripcion: descripcion,
        precio: `$ ${precio}`,
        telefono: telefono,
        lat: lat,
        lng: lng,
        fotos: this.files
      })
        .then(() => {
          this.presentToast('Hotel registrado correctamente.', 'success');
          this.notificacionNuevoHotel();
          this.router.navigateByUrl('/tabs/home');
        })
        .catch((error) => {
          console.error('Error al registrar:', error);
          this.presentToast('Error al registrar el hotel.', 'danger');
        });
    }
  }

  guardarCoordenadas(coords: Point) {
    console.log('se llamó a guardarCoordenadas')
    this.formNuevoHotel.patchValue({ lat: coords.lat, lng: coords.lng });
    console.log('formulario es: ', this.formNuevoHotel)
  }

  onFileSelected(event: any) {
    const selectedFiles = event.target.files as FileList;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      this.files.push(file);

      const reader = new FileReader();
      reader.onload = () => this.images.push(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl);
    return await res.blob();
  }

  irAMapa() {
    this.router.navigateByUrl('/maps');
  }

  async notificacionNuevoHotel() {
    const hasPermissions = await LocalNotifications.checkPermissions();
    if (hasPermissions.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          title: '¡Hotel registrado!',
          body: '¡Gracias por registrar tu hotel en nuestra app!',
          id: 1,

          schedule: { at: new Date(Date.now() + 1000 * 3) }
        }
      ]
    });

  }
}