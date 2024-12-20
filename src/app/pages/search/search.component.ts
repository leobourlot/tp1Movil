import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IonSearchbar} from "@ionic/angular/standalone";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NativeGeocoder} from '@capgo/nativegeocoder';
import {Point} from "../../interfaces";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SearchComponent implements OnInit {

  @Output() cancelSearch: EventEmitter<any> = new EventEmitter(undefined);
  @Output() coordinates: EventEmitter<Point> = new EventEmitter<Point>();
  @Output() direccionChange: EventEmitter<string> = new EventEmitter<string>();
  buscando = false;
  direccion: string | undefined = undefined

  constructor() {
  }

  ngOnInit() {

  }

  async reverseGeocode() {
    if (!this.direccion && this.buscando) {
      return;
    }
    this.buscando = true;

    const direccionConcordia = this.direccion ? `${this.direccion}, Concordia` : 'Concordia'
    const response = await NativeGeocoder.forwardGeocode({
      apiKey: environment.googleMapsKey,
      addressString: direccionConcordia,
      useLocale: true,
      defaultLocale: 'es_AR'
    })
    this.buscando = false;
    if (response.addresses) {
      const address = response.addresses[0];
      const {latitude, longitude} = address
      this.coordinates.emit({lat: latitude, lng: longitude});
      this.direccionChange.emit(this.direccion);
    }

  }

  onClose() {
    if (this.buscando) {
      return;
    }
    this.direccion = undefined;
    this.cancelSearch.emit()
  }

}
