import { Injectable } from '@angular/core';
import { FirebaseAuthentication, User } from "@capacitor-firebase/authentication";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/firebase-config';
import { getFirestore, getDoc, doc, setDoc, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar Firebase Storage
import { HotelesService } from '../hoteles/hoteles.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor(private hotelesService: HotelesService) { }

  async guardarDatosUsuario(uid: string, params: { nombre: string, apellido: string, dni: string, fotoPerfilUrl?: string, tipoUsuario: string }): Promise<void> {
    try {
      await setDoc(doc(this.db, 'usuarios', uid), {
        nombre: params.nombre,
        apellido: params.apellido,
        dni: params.dni,
        fotoPerfilUrl: params.fotoPerfilUrl || null,
        tipoUsuario: params.tipoUsuario,
      });
    } catch (error) {
      console.error('Error guardando datos en Firestore:', error);
    }
  }

  async subirImagenPerfil(uid: string, archivo: File): Promise<string> {
    try {
      const storage = getStorage();
      const imagenRef = ref(storage, `usuarios/${uid}/perfil.jpg`);

      const snapshot = await uploadBytes(imagenRef, archivo);
      console.log('Imagen subida exitosamente!');

      const url = await getDownloadURL(imagenRef);
      return url;
    } catch (error) {
      console.error('Error subiendo la imagen de perfil:', error);
      throw error;
    }
  }

  async registroEmail(params: { email: string, password: string, nombre: string, apellido: string, dni: string, tipoUsuario: string }): Promise<User | null> {

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
          dni: params.dni,
          tipoUsuario: params.tipoUsuario
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

  async registroHotel(params: { nombre: string, direccion: string, lat: number, lng: number}): Promise<void> {
    try {
  
      // Llama a la función guardarDatosHotel con los parámetros.
      await this.hotelesService.guardarDatosHotel({
        nombre: params.nombre,
        direccion: params.direccion,
        lat: params.lat,
        lng: params.lng
      });
  
      console.log('Hotel registrado correctamente');
    } catch (error) {
      console.error('Error registrando hotel:', error);
      throw error;
    }
  }

  async actualizarUsuario(params: { nombre: string, apellido: string, dni: string, archivoImagen?: File, tipoUsuario: string }): Promise<User | null> {
    try {
      const { user } = await FirebaseAuthentication.getCurrentUser();

      if (user) {
        let fotoUrl: string | undefined;

        if (params.archivoImagen) {
          fotoUrl = await this.subirImagenPerfil(user.uid, params.archivoImagen);
        }

        await this.guardarDatosUsuario(user?.uid, {
          nombre: params.nombre,
          apellido: params.apellido,
          dni: params.dni,
          fotoPerfilUrl: fotoUrl,
          tipoUsuario: params.tipoUsuario
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
        const userData = userDocSnapshot.data() as { nombre: string; apellido: string; dni: string, fotoPerfilUrl: string | undefined, tipoUsuario: string };

        return {
          email: user.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          fotoPerfilUrl: userData.fotoPerfilUrl,
          tipoUsuario: userData.tipoUsuario
        };
      } else {
        console.error('No se encontraron datos adicionales del usuario en Firestore.');
        return console.log('')
      }
    }

  }

  async cerrarSesion(): Promise<void> {
    await FirebaseAuthentication.signOut();
  }

}
