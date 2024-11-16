import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class TrasladosService {

  db = getFirestore(initializeApp(firebaseConfig));

  constructor() { }

  async cargarTraslados() {

    const trasladosRef = collection(this.db, 'traslados');
    const snapshot = await getDocs(trasladosRef);
    const traslados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return traslados
  }
}


