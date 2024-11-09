import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async guardarDatosHotel(params: { nombre: string, direccion: string}): Promise<void> {
    try {

    //Obtengo el usuario logueado para almacenar en el hotel el uid del propietario
    const { user } = await FirebaseAuthentication.getCurrentUser();

    const docRef = await addDoc(collection(this.db, 'hoteles'), {
      nombre: params.nombre,
      direccion: params.direccion,
      uidPropietario: user?.uid
    });
    } catch (error) {
      console.error('Error guardando datos del hotel en Firestore:', error);
    }
  }
}
