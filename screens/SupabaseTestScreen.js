// screens/SupabaseTestScreen.js
// Componente di test minimalista per verificare la connessione a Supabase e le policy RLS.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../supabaseClient'; // Assicurati che il percorso sia corretto

export default function SupabaseTestScreen() {
  const [testResult, setTestResult] = useState('Eseguo il test di Supabase...');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runSupabaseTest = async () => {
      setLoading(true);
      setTestResult('Tentativo di connessione e lettura da Supabase...');
      //console.log('SupabaseTestScreen: Avvio del test di connessione...');

      try {
        // Test di connessione (supabaseClient.js viene importato prima)
        //console.log('SupabaseTestScreen: Client Supabase inizializzato. Tentativo di SELECT dalla tabella "zeta"...');

        const { data: fetchedData, error: fetchedError } = await supabase
          .from('zeta')
          .select('id, player_name, score, created_at')
          .order('score', { ascending: false })
          .limit(5);

        if (fetchedError) {
          //console.log('SupabaseTestScreen: Query SELECT riuscita! Dati:', fetchedData);
          console.error('SupabaseTestScreen: Errore nella query SELECT:', fetchedError);
          setError(fetchedError);
          setTestResult(`Errore nella query SELECT: ${fetchedError.message || 'Errore sconosciuto'}`);
        } else {
          //console.log('SupabaseTestScreen: Query SELECT riuscita! Dati:', fetchedData);
          console.log('SupabaseTestScreen: Query SELECT riuscita! Dati:', fetchedData);
          setData(fetchedData);
          setTestResult('Connessione e query SELECT riuscite!');
        }

      } catch (e) {
        console.error('SupabaseTestScreen: Errore critico nel test di Supabase:', e);
        setError(e);
        setTestResult(`Errore critico durante il test: ${e.message || 'Errore sconosciuto'}. Controlla la console per i dettagli.`);
      } finally {
        setLoading(false);
      }
    };

    runSupabaseTest();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TEST SUPABASE</Text>
      <ActivityIndicator animating={loading} size="large" color="#00ff00" />
      <Text style={styles.statusText}>{testResult}</Text>

      {error && (
        <ScrollView style={styles.errorContainer}>
          <Text style={styles.errorText}>Dettagli Errore:</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          {error.details && <Text style={styles.errorText}>Dettagli: {error.details}</Text>}
          {error.hint && <Text style={styles.errorText}>Suggerimento: {error.hint}</Text>}
          {error.code && <Text style={styles.errorText}>Codice: {error.code}</Text>}
        </ScrollView>
      )}

      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Dati Recuperati (Top 5):</Text>
          {data.length === 0 ? (
            <Text style={styles.dataText}>Nessun dato nella tabella 'zeta'.</Text>
          ) : (
            data.map((item, index) => (
              <Text key={item.id || index} style={styles.dataText}>
                {item.player_name} - {item.score}
              </Text>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ff000033', // Rosso semitrasparente
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
    maxHeight: 150,
  },
  errorText: {
    color: '#ffaaaa',
    fontSize: 14,
  },
  dataContainer: {
    backgroundColor: '#0000ff33', // Blu semitrasparente
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
    maxHeight: 200,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaaaff',
    marginBottom: 5,
  },
  dataText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
