import { initSignatures } from './signatures.js';
import { initDamageMap } from './damageMap.js';
import { initPhotos } from './photos.js';
import { setupPrint } from './print.js';

document.addEventListener('DOMContentLoaded', () => {
    initSignatures();
    initDamageMap();
    initPhotos();
    setupPrint();
});
