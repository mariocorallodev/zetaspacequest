// game/constants.js
// Questo file contiene tutte le costanti fisiche e gli asset del gioco.
// È il nostro "specialista" per le configurazioni di gameplay.

import { Dimensions } from 'react-native';

// --- Dimensioni Schermo ---
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Proprietà Giocatore ---
export const DOG_WIDTH = 80;
export const DOG_HEIGHT = 80;

// --- Proprietà Proiettili ---
export const POOP_WIDTH = 20;
export const POOP_HEIGHT = 20;

// --- Proprietà Nemici ---
export const ENEMY_WIDTH = 40;
export const ENEMY_HEIGHT = 40;
export const ENEMY_MOVE_SPEED = 10;
export const ENEMY_VERTICAL_MOVE = ENEMY_HEIGHT / 2;

// --- Proprietà Power-Up ---
export const POWERUP_SIZE = 50;

// --- Regole di Gioco ---
export const INITIAL_LIVES = 3;
export const FIRE_COOLDOWN = 250;

// --- Asset Immagini ---
export const dogImage = require('../assets/zeta2.png');
export const poopImage = require('../assets/poop.png');
export const powerUpImage = require('../assets/power.png');

// --- Asset Suoni ---
export const poopSound = require('../assets/poop.mp3');
export const fartSound = require('../assets/fart.mp3');
export const explosionSound = require('../assets/explosion.mp3');
export const gameOverSound = require('../assets/gameover.mp3');
export const lifeSound = require('../assets/life.mp3');
export const powerUpSoundFile = require('../assets/powerup.mp3');
