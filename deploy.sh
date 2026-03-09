#!/usr/bin/env bash
# deploy.sh — Build with cache-busting, commit, and push to GitHub Pages.
# Usage: ./deploy.sh "optional commit message"

set -euo pipefail

MSG="${1:-Update deck}"

# 1. Reset any previous cache-bust hash back to the placeholder token
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -E 's/\?v=[a-f0-9]{8}/\?v=__CACHE_BUST__/g' index.html
else
  sed -i -E 's/\?v=[a-f0-9]{8}/\?v=__CACHE_BUST__/g' index.html
fi

# 2. Generate a fresh hash from CSS + JS content
HASH=$(cat styles.css main.js | shasum -a 256 | cut -c1-8)

# 3. Stamp the hash into index.html
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/__CACHE_BUST__/${HASH}/g" index.html
else
  sed -i "s/__CACHE_BUST__/${HASH}/g" index.html
fi

echo "Cache bust applied: v=${HASH}"

# 4. Stage, commit, and push
git add -A
git commit -m "${MSG}" || echo "Nothing to commit."
git push

echo "Deployed with cache bust v=${HASH}"
