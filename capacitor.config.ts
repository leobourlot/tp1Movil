import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tp.bourlot.derudder.arce',
  appName: 'concorSuite',
  webDir: 'www',
  plugins: {
    "FirebaseAuthentication": {
      "skipNativeAuth": false,
      "providers": []
    }
  }
};

export default config;
