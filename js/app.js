import { initConfig } from './config.js';
import { initSignatures } from './signatures.js';
import { initDamageMap } from './damageMap.js';
import { initPhotos } from './photos.js';
import { setupPrint } from './print.js';
import { initVistoriaStorage } from './vistoriaStorage.js';

document.addEventListener('DOMContentLoaded', () => {
    initConfig();
    initSignatures();
    initDamageMap();
    initPhotos();
    setupPrint();
    initVistoriaStorage();
});
