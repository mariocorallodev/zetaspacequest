#!/bin/bash

PROJECT_DIR="."
BACKUP_DIR="./backup_js_originali"
EXTENSIONI=("*.js" "*.jsx")

mkdir -p "$BACKUP_DIR"

echo "📦 Backup e pulizia in corso nei file JS/JSX del progetto..."

for EXT in "${EXTENSIONI[@]}"; do
  FILES=$(find "$PROJECT_DIR" -type f -name "$EXT")

  for FILE in $FILES; do
    echo "🔍 Pulizia: $FILE"

    DEST="$BACKUP_DIR/$FILE"
    mkdir -p "$(dirname "$DEST")"
    cp "$FILE" "$DEST"

    iconv -f utf-8 -t utf-8 -c "$FILE" -o "$FILE.tmp" 2>/dev/null

    if [ -s "$FILE.tmp" ]; then
      mv "$FILE.tmp" "$FILE"
      echo "✅ Pulito: $FILE"
    else
      echo "⚠️  Fallita la pulizia: $FILE. File lasciato intatto."
      rm -f "$FILE.tmp"
    fi
  done
done

echo "🏁 Pulizia completata. Backup in: $BACKUP_DIR"
