import { Injectable } from '@angular/core';
import { IStorageService } from 'src/app/core/storage/iStorage.service';
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private iStorage: IStorageService) { }

  async registroEmail(params: { email: string, password: string }): Promise<any> {
    const resultado = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email: params.email,
      password: params.password
    });
    return resultado.user;
  }

  async actualizarUsuario(params: { nombre: string }): Promise<void> {
    const usuarioActualizado = await FirebaseAuthentication.updateProfile({
      displayName: params.nombre
    })
    console.log("usuarioActualizado", usuarioActualizado);
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

  async usuarioActual(){
    const user = await FirebaseAuthentication.getCurrentUser();
    return user
  }

  async cerrarSesion(): Promise<void>{
    await FirebaseAuthentication.signOut();
  }

  
}
