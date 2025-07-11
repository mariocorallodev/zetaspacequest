import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import AnimatedGroup from '../components/AnimatedGroup';
import AnimatedDog2 from '../components/AnimatedDog2';

// --- TESTO EMBEDDED DELLA STORIA ---
const STORY_TEXT = `Questo gioco nasce come tutte le cose un po' per caso, un po' per divertimento e un po' per noia, per riempire i momenti che altrimenti avrei passato a guardare serie TV, Instagram o il social del momento. Non che sia un male, solo mi piace tenere il cervello attivo.

Nasce dallo sconfinato e gigantesco amore che provo per gli animali in genere, e per la razza canina in particolare: con le loro mille faccette buffe, i loro codoni stolti e le loro mossette senza senso.

Lo so, se non hai un cane fai fatica a capire, ma forse non così tanto.

Nasce dalle mie giornate scandite dal portare fuori la mia stolta e amorevole cagnolina Zeta Reticoli, nelle sue mille avventure normali che diventano spaziali perché io mi immagino ogni sua interazione con voce narrante e scenari apocalittici e biblici, che per lei sono il cuore della vita, e così lo sono diventato anche per me.

E così mi sono immaginato che potesse andare nello spazio, a combattere contro i suoi più acerrimi nemici: i fuochi d'artificio, l'aspirapolvere, gli skate. Ma non potrebbe combattere senza i suoi fedeli amici perchè l'unione fa la forza, per cui a ogni livello ecco che arriva un fedele cagnolino in aiuto della povera Zeta, a ogni livello una nuova avventura, a ogni avventura un nuovo mondo.

Nasce dall'incontro quotidiano, circa 700/900 volte all'anno, con altri padroni di cane che tutti i santi giorni, con il sole a 38 gradi, la neve o il temporale, devono portare fuori i loro quattrozampe. E così si condividono quei momenti, nascono amicizie, muoiono amicizie, perché come si dice in gergo "i cani si prendono", e quello si vede proprio che non poteva fare altro che prendere un cane così. E non sono i cani, ma i padroni. E vuoi chiudere il c***o di cancello che mi scappa il cane e poi chi me lo riprende, tu???

E in tutto questo, Zeta Reticoli ha decine, se non centinaia, di amici con i quali gioca tutti i santi giorni, e ogni volta è come se fosse la prima volta che li vede. E ogni volta che deve uscire è come se fosse la prima. E ogni volta, insomma... se avete un cane lo sapete.

Questo gioco è dedicato a Zeta Reticoli, a tutti i suoi amici e ai loro padroni di cane. È dedicato ai miei bambini, Stella e Leone, che non sono più tanto bambini ma che spero avranno sempre la forza e il coraggio di rimanerlo un po'. Perché a crescere si fa presto e si rischia di lasciare indietro pezzi che tanto sono lì, e tornano a far visita in diversi modi.

Questo gioco non sarebbe stato possibile senza la mia dolce Gaia, che sopporta interi pomeriggi a cercare di parlarmi mentre sono concentrato a disegnare personaggi e deployare funzioni. Le parlo a stento e mi metto le cuffie per non farmi infastidire. Ha davvero tanta pazienza, bisogna ammetterlo.

A tutti quelli che ho incontrato nella vita, che magari sono rimasti, che magari si sono persi e che purtroppo non ci sono più.

Alla mia famiglia tutta, nessuno escluso, comprese Panda e Abi che ha deciso di andarsene anni fa ma, essendo stata la prima, sarà sempre come me.

Love you all, keep on playing in this mad world!`;

export default function StoryScreen({ onBack }) {
  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
  const [scrolling, setScrolling] = useState(true); // scroll attivo inizialmente
  const scrollViewRef = useRef(null);
  const soundRef = useRef(null);

  // Caricamento audio in loop
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/levels/1_4.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!scrolling) return;

    let scrollPosition = 0;
    const scrollInterval = setInterval(() => {
      if (scrollViewRef.current) {
        scrollPosition += 1;
        scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, [scrolling]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'white' }}>Caricamento font...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scroll}
        scrollEnabled={true}
        onTouchStart={() => setScrolling(false)} // ⬅️ TAP o SCROLL disabilita auto-scroll
      >
        {/* Titolo */}
        <Text style={styles.titolo}>STORIA</Text>

        {/* Animazione sotto al titolo */}
        <View style={{ marginVertical: 0 }}>
          <AnimatedGroup size={380} />
        </View>

        {/* Testo embeddato */}
        <Text style={styles.testo}>{STORY_TEXT}</Text>

        {/* Animazione prima del bottone */}
        <AnimatedDog2 size={180} />

        {/* Bottone */}
        <TouchableOpacity style={styles.bottone} onPress={onBack}>
          <Text style={styles.bottoneTesto}>INDIETRO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================
// STILI STABILI
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 24,
  },
  scroll: {
    paddingTop: 4, // Ridotto
    paddingBottom: 0, // Ridotto
    alignItems: 'center',
  },
  titolo: {
    color: '#ffe600',
    fontSize: 24,
    fontFamily: 'PressStart2P',
    marginBottom: 4, // Ridotto
    textAlign: 'center',
  },
  testo: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'PressStart2P',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
    marginTop: 20,
  },
  bottone: {
    backgroundColor: '#ffe600',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 40,
  },
  bottoneTesto: {
    color: '#222',
    fontSize: 14,
    fontFamily: 'PressStart2P',
    textAlign: 'center',
  },
  storyImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginVertical: 8, // Ridotto
    alignSelf: 'center',
  },
}); 