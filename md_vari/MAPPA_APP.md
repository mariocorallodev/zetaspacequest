# 🎮 MAPPA COMPLETA ZETA SPACE QUEST

## 📁 STRUTTURA PRINCIPALE

### 🏠 FILE PRINCIPALI
- **`App.js`** - Il cervello dell'app, gestisce tutto il flusso principale
- **`index.js`** - Punto di ingresso dell'app
- **`package.json`** - Dipendenze e configurazione

### 🎨 COMPONENTI UI (`/components/`)
- **`AnimatedDog.js`** - Cane animato per IntroScreen
- **`AnimatedDog2.js`** - Cane animato per ModeChoiceScreen  
- **`AnimatedDog3.js`** - Cane animato per livello 30 (ASA)
- **`BossEnemy.js`** - Rendering dei boss
- **`BossHealthBar.js`** - Barra vita dei boss
- **`BossProjectiles.js`** - Proiettili dei boss
- **`Dog.js`** - Il cane giocatore principale
- **`Enemies.js`** - Nemici normali
- **`Explosions.js`** - Animazioni esplosioni
- **`GameControls.js`** - Controlli di gioco
- **`GameHUD.js`** - Interfaccia gioco (vite, punteggio)
- **`GameOverOverlay.js`** - Schermata game over
- **`LevelCompleteOverlay.js`** - Schermata completamento livello
- **`PauseOverlay.js`** - Schermata pausa
- **`Poops.js`** - Proiettili del cane
- **`TopIcons.js`** - Icone in alto (pausa, skip)
- **`VirtualJoystick.js`** - Joystick virtuale

### 🖥️ SCHERMATE (`/screens/`)
- **`IntroScreen.js`** - Schermata iniziale con menu
- **`ModeChoiceScreen.js`** - Scelta modalità (ZEN, NORMAL, ADVANCED, PANIC)
- **`LeaderboardScreen.js`** - Classifica punteggi
- **`Leaderboard2Screen.js`** - Seconda classifica
- **`HowToScreen.js`** - Come giocare
- **`StoryScreen.js`** - Storia del gioco
- **`CreditsScreen.js`** - Crediti

### 🎯 LIVELLI (`/levels/`)
- **`level1.js`** a **`level30.js`** - Tutti i livelli del gioco
- **`bossabi.js`** - Boss Abi
- **`bossjasper.js`** - Boss Jasper
- **`README_LIVELLI.md`** - Documentazione livelli

### ⚙️ CONFIGURAZIONE (`/config/`)
- **`projectiles.js`** - Configurazione proiettili

### 🎮 LOGICA GIOCO (`/game/`)
- **`bossLevelManager.js`** - Gestione boss
- **`constants.js`** - Costanti del gioco
- **`powerups.js`** - Logica powerup

### 🎨 STILI (`/styles/`)
- **`GameStyle.js`** - Stili principali dell'app

### 🔧 UTILITY (`/utils/`)
- **`Animations.js`** - Animazioni personalizzate
- **`bossShakeAnimation.js`** - Animazione shake boss
- **`gameModes.js`** - Gestione modalità gioco

### 🗄️ DATABASE
- **`supabaseClient.js`** - Connessione database Supabase

---

## 🧠 FUNZIONI PRINCIPALI IN APP.JS

### 🎮 GESTIONE GIOCO
```javascript
// Riga 183 - Avvia il gioco
const handleStartGame = () => { ... }

// Riga 572 - Game over
const handleGameOver = () => { ... }

// Riga 586 - Reset completo
const resetGame = () => { ... }

// Riga 614 - Pausa/riprendi
const togglePause = () => { ... }

// Riga 616 - Esci dal gioco
const exitGame = () => { ... }
```

### 🎯 GESTIONE LIVELLI
```javascript
// Riga 350 - Inizializza nemici
const initializeEnemies = () => { ... }

// Riga 370 - Completamento livello
const handleLevelComplete = () => { ... }

// Riga 393 - Forza prossimo livello
const forceNextLevel = () => { ... }
```

### 🔄 LOOP DI GIOCO
```javascript
// Riga 407 - Funzione principale di aggiornamento
const onUpdate = () => { ... }
```

### 🎵 AUDIO
```javascript
// Riga 238 - Carica suoni
const loadGenericSounds = async () => { ... }

// Riga 306 - Gestione musica
const manageMusic = async () => { ... }
```

---

## 🎯 DOVE TROVARE COSE SPECIFICHE

### 🎮 POWERUP
- **Frequenza caduta**: `App.js` riga 268 - `const delay = Math.random() * 3000 + 3000;`
- **Logica collisione**: `App.js` riga 461-490
- **Gestione modalità**: `App.js` riga 275-285

### 🎵 MUSICA
- **Caricamento**: `App.js` riga 306-325
- **Controllo volume**: `App.js` riga 248
- **File audio**: `/assets/sounds/levels/`

### 🎨 UI E STILI
- **Stili principali**: `/styles/GameStyle.js`
- **Font**: `PressStart2P` (stile retro)
- **Colori anni '80**: Fucsia `#FF00FF`, Ciano `#00FFFF`

### 🗄️ LEADERBOARD
- **Salvataggio punteggi**: `LeaderboardScreen.js` riga 170-190
- **Caricamento classifica**: `LeaderboardScreen.js` riga 195-210
- **Scroll automatico**: `LeaderboardScreen.js` riga 220-240

### 🎯 LIVELLI
- **Configurazione**: Ogni file in `/levels/`
- **Boss**: `bossLevelManager.js`
- **Modalità**: `gameModes.js`

### 🐕 ANIMAZIONI CANI
- **IntroScreen**: `AnimatedDog.js`
- **ModeChoice**: `AnimatedDog2.js`
- **Livello 30**: `AnimatedDog3.js`

---

## 🔧 COSTANTI IMPORTANTI

### 📏 DIMENSIONI (App.js)
```javascript
// Riga 90-93
const POWERUP_SIZE = 50;
const POWERUP_COLLISION_TOLERANCE_Y = 15;
const POWERUP_SPEED = 3;
const POWERUP_HORIZONTAL_MARGIN = 40;
```

### 🎮 MODALITÀ GIOCO
- **ZEN**: 3 vite, powerup frequenti
- **NORMAL**: 2 vite, powerup normali  
- **ADVANCED**: 1 vita, powerup rari
- **PANIC**: 1 vita, powerup rari

### 🎯 LIVELLI BOSS
- **Livello 10**: Boss Abi
- **Livello 20**: Boss Jasper  
- **Livello 30**: Boss ASA (Padrone)

---

## 🚀 COME MODIFICARE COSE COMUNI

### 🎮 Cambiare frequenza powerup
**File**: `App.js` riga 268
```javascript
const delay = Math.random() * 3000 + 3000; // 3-6 secondi
```

### 🎵 Cambiare musica
**File**: `levels/levelX.js`
```javascript
backgroundMusicFile: require('../assets/sounds/levels/nuova_musica.mp3')
```

### 🎨 Cambiare colori
**File**: `styles/GameStyle.js` o direttamente nei componenti

### 🐕 Cambiare animazioni
**File**: `components/AnimatedDogX.js`

### 📊 Modificare leaderboard
**File**: `screens/LeaderboardScreen.js`

---

## 🎯 FLUSSO DELL'APP

1. **`index.js`** → Carica l'app
2. **`App.js`** → Gestisce la navigazione tra schermate
3. **`IntroScreen`** → Menu principale
4. **`ModeChoiceScreen`** → Scelta modalità
5. **`App.js`** → Loop di gioco principale
6. **`LeaderboardScreen`** → Salvataggio punteggi

---

## 💡 SUGGERIMENTI

- **Per modifiche UI**: Cerca prima in `/styles/GameStyle.js`
- **Per logica gioco**: Cerca in `App.js` o `/game/`
- **Per nuovi livelli**: Copia un livello esistente in `/levels/`
- **Per nuovi componenti**: Crea in `/components/`
- **Per nuove schermate**: Crea in `/screens/`

---

*Questa mappa ti aiuterà a navigare nel progetto! 🚀* 

## 🎮 **MIGLIORAMENTI GAMEPLAY**

### 🏆 **Sistema di Achievement**
```javascript
<code_block_to_apply_changes_from>
```

###  **Modalità Speciali**
- **Time Attack**: Completare livelli contro il tempo
- **Survival**: Ondate infinite di nemici
- **Boss Rush**: Solo livelli boss
- **Mirror Mode**: Controlli invertiti

### 💎 **Sistema di Monete/Gemme**
- Raccogli monete durante il gioco
- Sblocca skin per il cane
- Compra powerup extra
- Shop con cosmetici

## 🎨 **MIGLIORAMENTI VISIVI**

### ✨ **Effetti Partice**
- Particelle quando il cane spara
- Esplosioni più elaborate
- Effetti di scia per i proiettili
- Particelle di vittoria

### 🎭 **Skin e Personalizzazione**
- Diverse skin per il cane
- Temi di sfondo sbloccabili
- Effetti sonori personalizzabili
- Colori UI personalizzabili

###  **Animazioni Avanzate**
- Transizioni tra livelli più elaborate
- Animazioni di vittoria/sconfitta
- Effetti di camera shake migliorati
- Animazioni di UI più fluide

## 🎵 **MIGLIORAMENTI AUDIO**

###  **Sistema Audio Avanzato**
- Mixer audio per effetti/musica
- Suoni 3D per immersione
- Audio reattivo (più veloce = musica più veloce)
- Voice-over per tutorial

### 🎧 **Playlist Personalizzate**
- Selezione musica per livello
- Shuffle automatico
- Volume separato per effetti/musica

## 📊 **MIGLIORAMENTI DATI**

###  **Statistiche Dettagliate**
```javascript
// Traccia statistiche come:
- Tempo totale di gioco
- Nemici eliminati per tipo
- Powerup utilizzati
- Livelli completati per modalità
- Record personali
```

### 🏅 **Sistema di Ranking Avanzato**
- Classifiche settimanali/mensili
- Badge per performance
- Sfide globali
- Clan/team system

## 🎯 **FUNZIONALITÀ SOCIAL**

### 👥 **Multiplayer Locale**
- Modalità 2 giocatori sullo stesso schermo
- Competizione amichevole
- Condivisione punteggi

### 🌐 **Condivisione Social**
- Screenshot automatici dei record
- Condivisione su social media
- Inviti amici a giocare

## 🔧 **MIGLIORAMENTI TECNICI**

### ⚡ **Performance**
- Ottimizzazione rendering
- Lazy loading delle risorse
- Cache intelligente
- Compressione audio/immagini

###  **Accessibilità**
- Controlli personalizzabili
- Modalità daltonismo
- Testo più grande
- Feedback tattile

### 🔄 **Cloud Save**
- Salvataggio progressi nel cloud
- Sincronizzazione multi-dispositivo
- Backup automatico

## 🎪 **CONTENUTI EXTRA**

### 📖 **Storia Espansa**
- Cutscene animate
- Dialoghi tra livelli
- Background dei personaggi
- Easter eggs nascosti

### 🎨 **Editor di Livelli**
- Crea i tuoi livelli
- Condividi con la community
- Rating dei livelli creati
- Challenge settimanali

###  **Shop In-Game**
- Skin premium
- Powerup speciali
- Boost temporanei
- Contenuti esclusivi

## 🚀 **QUALI IMPLEMENTARE PRIMA?**

### 🥇 **Priorità Alta** (Grande impatto, poco sforzo):
1. **Sistema Achievement** - Motiva a giocare di più
2. **Statistiche dettagliate** - Mostra progresso
3. **Effetti particelle** - Migliora visivamente
4. **Skin del cane** - Personalizzazione

###  **Priorità Media** (Buon impatto, sforzo medio):
1. **Modalità Time Attack**
2. **Sistema monete**
3. **Audio reattivo**
4. **Cloud save**

###  **Priorità Bassa** (Futuro):
1. **Multiplayer**
2. **Editor livelli**
3. **Shop premium**

## 💡 **SUGGERIMENTO PERSONALE**

Inizia con il **Sistema Achievement** perché:
- ✅ Facile da implementare
- ✅ Aumenta la retention
- ✅ Dà senso di progressione
- ✅ Motiva a completare tutto

Vuoi che ti aiuti a implementare uno di questi miglioramenti? Dimmi quale ti interessa di più! 🎮✨

// Aggiungi achievements come:
- "Sopravvissuto 5 minuti" 
- "100 nemici eliminati"
- "Powerup collezionato 10 volte"
- "Completato livello senza danni" 