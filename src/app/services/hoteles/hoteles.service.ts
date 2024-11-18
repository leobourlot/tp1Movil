import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseConfig } from 'src/environments/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async guardarDatosHotel(params: { nombre: string, direccion: string, descripcion: string, lat: number, precio: string, telefono: string, lng: number, fotos: File[] }): Promise<void> {
    try {

      //Obtengo el usuario logueado para almacenar en el hotel el uid del propietario
      const { user } = await FirebaseAuthentication.getCurrentUser();

      if (!user?.uid) {
        throw new Error('No se encontró un usuario autenticado.');
      }

      // Sube las fotos al almacenamiento y obtén las URLs
      const urlsFotos = await this.subirFotosHotel(user.uid, params.fotos);

      const docRef = await addDoc(collection(this.db, 'hoteles'), {
        nombre: params.nombre,
        direccion: params.direccion,
        descripcion: params.descripcion,
        precio: params.precio,
        telefono: params.telefono,
        fotos: urlsFotos,
        uidPropietario: user?.uid,
        lat: params.lat,
        lng: params.lng
      });
    } catch (error) {
      console.error('Error guardando datos del hotel en Firestore:', error);
    }
  }

  async subirFotosHotel(uid: string, archivos: File | File[]): Promise<string | string[]> {
    try {
      const storage = getStorage();

      const archivosArray = Array.isArray(archivos) ? archivos : [archivos];

      const urls = await Promise.all(
        archivosArray.map(async (archivo) => {
          const imagenRef = ref(storage, `hoteles/${uid}/'${Date.now()}_${archivo.name}.jpg`);

          const snapshot = await uploadBytes(imagenRef, archivo);
          console.log(`Imagen subida exitosamente: ${snapshot.metadata.name}`);

          return await getDownloadURL(imagenRef);
        })
      );

      return Array.isArray(archivos) ? urls : urls[0];

    } catch (error) {
      console.error('Error al cargar las imágenes: ', error);
      throw error;
    }
  }

  async getHoteles(): Promise<any[]> {
    const { user } = await FirebaseAuthentication.getCurrentUser();

    if (user) {
      // const uid = user.uid;

      const hotelesRef = collection(this.db, 'hoteles');

      // const q = query(hotelesRef, where('uidPropietario', '!=', 1));

      const querySnapshot = await getDocs(hotelesRef);

      const hoteles = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return { ...data, uid: doc.id }
      });
      console.log('hoteles en service es: ', hoteles);
      return hoteles;
    }
    return [];
  }

  async obtenerHotelPorId(id: string): Promise<any> {
    const docRef = doc(this.db, 'hoteles', id);
    const docSnapShot = await getDoc(docRef);
    if (docSnapShot.exists()){
      return {id: docSnapShot.id, ...docSnapShot.data()};
    } else{
      throw new Error ('No se encontró el hotel seleccionado.')
    }
    // const hoteles = await this.getHoteles();
    // return hoteles.find((hotel: any) => hotel.id === id);
  }

  async cargarHoteles() {
    const { user } = await FirebaseAuthentication.getCurrentUser();

    if (user) {
      const hotelesRef = collection(this.db, 'hoteles');
      const snapshot = await getDocs(hotelesRef);
      const hoteles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return hoteles
    }
    else {
      return []
    }

  }

}
