#!/bin/bash
# web/ is deployed as a self-contained unit (no access to sibling repo-root files
# at runtime). This copies everything it needs from the repo root into web/ itself,
# where it gets committed to git so it's present in any deployment.
#
# Runs automatically via predev/prebuild. If ../assets doesn't exist (e.g. this
# script somehow runs outside a full checkout), it no-ops and whatever was last
# committed under web/public/ and web/content/ is used as-is.
set -e
cd "$(dirname "$0")/.."

if [ ! -d ../assets ]; then
  echo "sync-content: ../assets not found, skipping — using committed copies as-is."
  exit 0
fi

rm -rf public/assets content
mkdir -p content

cp -R ../assets public/assets
find public/assets -name ".DS_Store" -delete

# index.html is deliberately excluded — the Next.js dashboard at "/" replaces its
# role as the internal page-directory hub; copying it would collide with that route.
for f in ../*.html; do
  base="$(basename "$f")"
  [ "$base" = "index.html" ] && continue
  cp "$f" "public/$base"
done

cp ../generator/GENERATOR-PROMPT.md content/GENERATOR-PROMPT.md
cp ../RESEARCH.md content/RESEARCH.md
cp ../figma-plugin/code.js content/figma-plugin-code.js

echo "sync-content: refreshed web/public/{assets,*.html} and web/content/ from repo root."
