import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async guardarDatosHotel(uid: string, params: { nombre: string, direccion: string, fotosHotel?: string[] }): Promise<void> {
    try {
      await setDoc(doc(this.db, 'hoteles', uid), {
        nombre: params.nombre,
        direccion: params.direccion,        
        fotosHotel: params.fotosHotel || null,
        
      });
    } catch (error) {
      console.error('Error guardando datos en Firestore:', error);
    }
  }
}
