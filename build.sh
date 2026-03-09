#!/usr/bin/env bash
# build.sh — Replace __CACHE_BUST__ tokens in index.html with a content hash.
# Run this before each deploy: ./build.sh

set -euo pipefail

# Generate a short hash from the combined content of styles.css and main.js
HASH=$(cat styles.css main.js | shasum -a 256 | cut -c1-8)

# Replace the placeholder token with the hash
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/__CACHE_BUST__/${HASH}/g" index.html
else
  sed -i "s/__CACHE_BUST__/${HASH}/g" index.html
fi

echo "Cache bust applied: v=${HASH}"
