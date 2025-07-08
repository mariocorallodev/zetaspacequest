# Tabella Riassuntiva Livelli

| Livello | Righe (enemyRows) | Colonne (enemyCols) | Spaziatura (enemySpacing) | ZEN | NORMAL | ADVANCED | PANIC |
|---------|-------------------|---------------------|---------------------------|-----|--------|----------|-------|
| 1-5     | 1                 | 5                   | 20                        | 1   | 2      | 3        | 4     |
| 6-10    | 2                 | 6                   | 18                        | 2   | 4      | 6        | 8     |
| 11-15   | 3                 | 7                   | 15                        | 3   | 6      | 8        | 8     |
| 16-20   | 4                 | 8                   | 12                        | 4   | 8      | 8        | 8     |
| 21-25   | 5                 | 9                   | 10                        | 5   | 8      | 8        | 8     |
| 26-30   | 6                 | 10                  | 8                         | 6   | 8      | 8        | 8     |

**Legenda:**
- Le colonne ZEN/NORMAL/ADVANCED/PANIC indicano il numero di righe effettive dopo il moltiplicatore, limitate a massimo 8.
- I boss mantengono la coerenza con la progressione ma possono avere logica personalizzata.

**Logica moltiplicatore:**
- ZEN: ×1
- NORMAL: ×2
- ADVANCED: ×3
- PANIC: ×4
- Il risultato viene arrotondato e limitato a massimo 8 righe.

Esempio: Livello 12 (base 3 righe)
- ZEN: 3
- NORMAL: 6
- ADVANCED: 8 (3×3=9, ma max 8)
- PANIC: 8 (3×4=12, ma max 8) 