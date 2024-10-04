import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// import {FirebaseFirestore} from "@capacitor-firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class IStorageService {

  private storage: Storage | null = null;

  constructor(private ionicStorage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    this.storage = await this.ionicStorage.create();
  }

  async getValue(key: string) {
    if (!this.storage) {
      throw new Error('Storage no fue inicializado')
    }
    return this.storage.get(key);
  }

  async setValue(key: string, value: any) {
    if (!this.storage) {
      throw new Error('Storage no fue inicializado')
    }
    return this.storage.set(key, value);
  }

  async removeValue(key: string) {
    if (!this.storage) {
      throw new Error('Storage no fue inicializado')
    }
    return this.storage.remove(key)
  }


}
