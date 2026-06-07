import type { CapacitorConfig } from '@capacitor/cli';

import pkg from './package.json';

const config: CapacitorConfig = {
  appId: 'com.capgo.printer.example',
  appName: 'CapacitorPrinterExample',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    CapacitorUpdater: {
      appId: 'com.capgo.printer.example',
      autoUpdate: true,
      autoSplashscreen: true,
      directUpdate: 'always',
      defaultChannel: 'production',
      version: pkg.version,
    },
  },
};

export default config;
