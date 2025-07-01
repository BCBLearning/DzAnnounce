# Chemins
SOURCE_DIR="$HOME/DzAnnounce"
BACKUP_DIR="$HOME/DzAnnounceStore"

# Créer le dossier de destination s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Copier uniquement les fichiers utiles
rsync -av --progress "$SOURCE_DIR/" "$BACKUP_DIR/" \
  --exclude "node_modules" \
  --exclude ".git" \
  --exclude ".env" \
  --exclude "*.env.*" \
  --exclude "*.config.ts" \
  --exclude "*.lock" \
  --exclude "dist" \
  --exclude "build" \
  --exclude ".output" \
  --exclude "pnpm-lock.yaml" \
  --exclude "package-lock.json" \
  --exclude ".next" \
  --exclude ".turbo" \
  --exclude ".vercel" \
  --exclude ".netlify"

echo "✅ Sauvegarde terminée : $BACKUP_DIR"
