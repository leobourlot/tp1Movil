import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Storage } from '@ionic/storage-angular';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDxm79r92xrO5ychOB2DSZvpcVUNDRGZRo",
  authDomain: "tp-movil.firebaseapp.com",
  projectId: "tp-movil",
  storageBucket: "tp-movil.appspot.com",
  messagingSenderId: "835041877615",
  appId: "1:835041877615:web:850bcf665f7621f2be379a",
  measurementId: "G-YQCQCSYVTD"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    Storage,

  ],
});

