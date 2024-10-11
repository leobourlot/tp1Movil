import { Injectable } from '@angular/core';
import { IStorageService } from 'src/app/core/storage/iStorage.service';
import { FirebaseAuthentication, User } from "@capacitor-firebase/authentication";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/firebase-config';
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { UserData } from 'src/app/interfaces/userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async guardarDatosUsuario(uid: string, params: { nombre: string, apellido: string, dni: string }): Promise<void> {
    try {
      await setDoc(doc(this.db, 'usuarios', uid), {
        nombre: params.nombre,
        apellido: params.apellido,
        dni: params.dni
      });
    } catch (error) {
      console.error('Error guardando datos en Firestore:', error);
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

  async actualizarUsuario(params: { nombre: string, apellido: string, dni: string }): Promise<User | null> {
    try {
      const { user } = await FirebaseAuthentication.getCurrentUser();

      if (user) {
        await this.guardarDatosUsuario(user?.uid, {
          nombre: params.nombre,
          apellido: params.apellido,
          dni: params.dni
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

  // async guardarOtrosDatosUsuario(uid: string, params: { nombre: string, apellido: string, dni: string }) {
  //   // Suponiendo que tienes un servicio para interactuar con Firestore
  //   await this.firestore.collection('usuarios').doc(uid).set({
  //     nombre: params.nombre,
  //     apellido: params.apellido,
  //     dni: params.dni,
  //   });
  // }

  async loginEmail(params: { email: string, password: string }): Promise<any> {
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
        const userData = userDocSnapshot.data() as { nombre: string; apellido: string; dni: string };;
        
        return {
          email: user.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni, 
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
