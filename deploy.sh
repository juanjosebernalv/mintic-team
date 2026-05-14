#!/bin/bash
# ============================================================
# deploy.sh — Sube el proyecto a GitHub y despliega en Pages
# Repo: https://github.com/juanjosebernalv/mintic-team
# ============================================================
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo ""
echo "🚀  MINTIC 2026 — deploy a GitHub + GitHub Pages"
echo "================================================="

# 1. Limpiar lock residual del sandbox
if [ -f ".git/index.lock" ]; then
  echo "→ Eliminando index.lock residual..."
  rm -f .git/index.lock
fi

# 2. Asegurar rama main
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "unknown")
if [ "$CURRENT_BRANCH" = "master" ]; then
  echo "→ Renombrando rama master → main..."
  git branch -m main
fi

# 3. Commit inicial del código fuente
echo "→ Preparando commit del código fuente..."
git add .
git commit -m "feat: initial commit — React + Vite team showcase para MINTIC 2026" || echo "   (nada nuevo que commitear)"

# 4. Push del código fuente a main
echo "→ Subiendo código fuente a GitHub (rama main)..."
git push -u origin main

echo ""
echo "✅  Código fuente disponible en:"
echo "    https://github.com/juanjosebernalv/mintic-team"

# 5. Instalar dependencias si hace falta
if [ ! -d "node_modules" ]; then
  echo ""
  echo "→ Instalando dependencias (yarn)..."
  yarn install
fi

# 6. Build + deploy a GitHub Pages (rama gh-pages)
echo ""
echo "→ Construyendo y desplegando en GitHub Pages..."
yarn deploy

echo ""
echo "✅  Sitio publicado en:"
echo "    https://juanjosebernalv.github.io/mintic-team"
echo ""
echo "⚠️  GitHub Pages puede tardar 1-3 minutos en estar activo."
echo "    Si es la primera vez, activa Pages en:"
echo "    Settings → Pages → Source: 'Deploy from a branch' → Branch: gh-pages / root"
echo ""
