import { Injectable } from '@angular/core';
import { IStorageService } from 'src/app/core/storage/iStorage.service';
import { FirebaseAuthentication, User } from "@capacitor-firebase/authentication";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/firebase-config';
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { UserData } from 'src/app/interfaces/userData';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar Firebase Storage


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async guardarDatosUsuario(uid: string, params: { nombre: string, apellido: string, dni: string, fotoPerfilUrl?: string }): Promise<void> {
    try {
      await setDoc(doc(this.db, 'usuarios', uid), {
        nombre: params.nombre,
        apellido: params.apellido,
        dni: params.dni,
        fotoPerfilUrl: params.fotoPerfilUrl || null // Si no hay imagen, guarda null
      });
    } catch (error) {
      console.error('Error guardando datos en Firestore:', error);
    }
  }

  async subirImagenPerfil(uid: string, archivo: File): Promise<string> {
    try {
      const storage = getStorage(); // Obtener instancia de Firebase Storage
      const imagenRef = ref(storage, `usuarios/${uid}/perfil.jpg`); // Crear referencia a la ubicación en Storage
  
      // Acá falla , por problema de CORS, tengo que habilitar Storage.
      const snapshot = await uploadBytes(imagenRef, archivo);
      console.log('Imagen subida exitosamente!');
  
      // Obtener la URL de descarga de la imagen
      const url = await getDownloadURL(imagenRef);
      return url;
    } catch (error) {
      console.error('Error subiendo la imagen de perfil:', error);
      throw error;
    }
  }

  async registroEmail(params: { email: string, password: string, nombre: string, apellido: string, dni: string }): Promise<User | null> {

    try {

      const resultado = await FirebaseAuthentication.createUserWithEmailAndPassword({
        email: params.email,
        password: params.password
      });
      const usuario = resultado.user;

      if (usuario) {
        await this.guardarDatosUsuario(usuario?.uid, {
          nombre: params.nombre,
          apellido: params.apellido,
          dni: params.dni
        });
        return usuario;
      } else {
        throw new Error('Error: No se pudo obtener el UID del usuario.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async actualizarUsuario(params: { nombre: string, apellido: string, dni: string, archivoImagen?: File  }): Promise<User | null> {
    try {
      const { user } = await FirebaseAuthentication.getCurrentUser();

      if (user) {
        let fotoUrl: string | undefined;

        // Si se proporciona una nueva imagen, se sube primero a Firebase Storage
        if (params.archivoImagen) {
          fotoUrl = await this.subirImagenPerfil(user.uid, params.archivoImagen);
        }
      
        await this.guardarDatosUsuario(user?.uid, {
          nombre: params.nombre,
          apellido: params.apellido,
          dni: params.dni,
          fotoPerfilUrl: fotoUrl
        });
        return user;
      } else {
        throw new Error('Error: No se pudo obtener el UID del usuario.');
      }

    } catch (error) {
      console.error('Error en la actualización:', error);
      throw error;
    }
  }

  // async actualizarDatosUsuario(uid: string, params: { nombre: string, apellido: string, dni: string, foto: string }): Promise<void> {
  //   try {
  //     const { user } = await FirebaseAuthentication.getCurrentUser();

  //     if (user) {
  //       await setDoc(doc(this.db, 'usuarios', uid), {
  //         nombre: params.nombre,
  //         apellido: params.apellido,
  //         dni: params.dni,
  //         foto: params.foto
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error guardando datos en Firestore:', error);
  //   }
  // }

  // async guardarOtrosDatosUsuario(uid: string, params: { nombre: string, apellido: string, dni: string }) {
  //   // Suponiendo que tienes un servicio para interactuar con Firestore
  //   await this.firestore.collection('usuarios').doc(uid).set({
  //     nombre: params.nombre,
  //     apellido: params.apellido,
  //     dni: params.dni,
  //   });
  // }

  async loginEmail(params: { email: string, password: string }): Promise<User | null> {
    const resultado = await FirebaseAuthentication.signInWithEmailAndPassword({
      email: params.email,
      password: params.password
    });
    return resultado.user;
  }

  async usuarioActual() {
    const { user } = await FirebaseAuthentication.getCurrentUser();

    if (user) {
      const uid = user.uid;

      const userDocRef = doc(this.db, 'usuarios', uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as { nombre: string; apellido: string; dni: string, fotoPerfilUrl: string | undefined};
        
        return {
          email: user.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni, 
          fotoPerfilUrl: userData.fotoPerfilUrl
        };
      } else {
        console.error('No se encontraron datos adicionales del usuario en Firestore.');
        return console.log('')
        // return user;  
      }
    }

     
  }

  async cerrarSesion(): Promise < void> {
  await FirebaseAuthentication.signOut();
}


}
