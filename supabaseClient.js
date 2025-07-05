// supabaseClient.js
// Inizializza il client Supabase per la connessione al database.

import { createClient } from '@supabase/supabase-js';

// Le TUE credenziali Supabase reali, copiate direttamente dal pannello API di Supabase.
const supabaseUrl = 'https://mifvniycomkejnkkrskf.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZnZuaXljb21rZWpua2tyc2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTQ2MzAsImV4cCI6MjA2NTk5MDYzMH0.VVlv-1Y02blL1CSC5PsceMsEUvvE5jlDklG8T7I8Log'; 

// --- DEBUG: Logga i valori esatti prima della creazione del client ---
//console.log("DEBUG: supabaseUrl:", supabaseUrl);
//console.log("DEBUG: supabaseAnonKey:", supabaseAnonKey);
// --- FINE DEBUG ---

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//console.log("Supabase Client Inizializzato.");
