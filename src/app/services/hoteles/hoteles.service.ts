import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async guardarDatosHotel(params: { nombre: string, direccion: string, descripcion: string, lat: number, lng: number, fotos: File[]}): Promise<void> {
    try {

    //Obtengo el usuario logueado para almacenar en el hotel el uid del propietario
    const { user } = await FirebaseAuthentication.getCurrentUser();

    const docRef = await addDoc(collection(this.db, 'hoteles'), {
      nombre: params.nombre,
      direccion: params.direccion,
      descripcion: params.descripcion,
      fotos: params.fotos,
      uidPropietario: user?.uid,
      lat: params.lat,
      lng: params.lng
    });
    } catch (error) {
      console.error('Error guardando datos del hotel en Firestore:', error);
    }
  }

  async getHoteles(): Promise<any[]> {
    const { user } = await FirebaseAuthentication.getCurrentUser();
    
    if (user) {
      const uid = user.uid;
      
      const hotelesRef = collection(this.db, 'hoteles');
      
      const q = query(hotelesRef, where('uidPropietario', '==', uid));
      
      const querySnapshot = await getDocs(q);
      
      const hoteles = querySnapshot.docs.map(doc => doc.data());
      
      console.log(hoteles);
      return hoteles;
    }
    return [];
  }

}
