// config/projectiles.js

// Questo file definisce tutti i proiettili usati nel gioco.
// In questo modo, App.js non deve preoccuparsi dei singoli file di immagine.

export const mainProjectile = {
  image: require('../assets/poop.png'),
  width: 20,
  height: 20,
};

export const sidekickProjectile = {
  image: require('../assets/osso.png'), // <<< L'OSSO È QUI. Assicurati di avere questo file in /assets
  width: 20,
  height: 20,
};
