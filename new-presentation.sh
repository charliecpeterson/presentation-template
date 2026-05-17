#!/usr/bin/env bash
# new-presentation.sh — scaffold a new presentation from this template
#
# Usage:
#   ./new-presentation.sh <dir-name> ["Presentation Title"] ["Subtitle"]
#
# Examples:
#   ./new-presentation.sh hpc-workshop-2026
#   ./new-presentation.sh hpc-workshop-2026 "HPC Intro Workshop" "Spring 2026"

set -euo pipefail

TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Args ──────────────────────────────────────────────────────────────────────
DIR_NAME="${1:-}"
TITLE="${2:-Presentation Title}"
SUBTITLE="${3:-Subtitle or Workshop Name}"

if [[ -z "$DIR_NAME" ]]; then
  echo "Usage: $0 <dir-name> [\"Title\"] [\"Subtitle\"]"
  exit 1
fi

TARGET_DIR="$(dirname "$TEMPLATE_DIR")/$DIR_NAME"

if [[ -d "$TARGET_DIR" ]]; then
  echo "Error: $TARGET_DIR already exists."
  exit 1
fi

# ── Copy template ─────────────────────────────────────────────────────────────
mkdir -p "$TARGET_DIR/assets"

cp "$TEMPLATE_DIR/_quarto.yml"        "$TARGET_DIR/_quarto.yml"
cp "$TEMPLATE_DIR/custom.scss"        "$TARGET_DIR/custom.scss"
cp "$TEMPLATE_DIR/AGENTS.md"          "$TARGET_DIR/AGENTS.md"
cp "$TEMPLATE_DIR/slide-patterns.md"  "$TARGET_DIR/slide-patterns.md"
cp "$TEMPLATE_DIR/content-design.md"  "$TARGET_DIR/content-design.md"
cp "$TEMPLATE_DIR/build.sh"           "$TARGET_DIR/build.sh"
chmod +x "$TARGET_DIR/build.sh"

# CLAUDE.md is a symlink → AGENTS.md so Claude Code reads it natively.
# Recreate the symlink in the target directory (don't dereference).
ln -s AGENTS.md "$TARGET_DIR/CLAUDE.md"

# Copy template.qmd → <dir-name>.qmd and substitute title/subtitle
sed \
  -e "s/Presentation Title/$TITLE/" \
  -e "s/Subtitle or Workshop Name/$SUBTITLE/" \
  "$TEMPLATE_DIR/template.qmd" > "$TARGET_DIR/$DIR_NAME.qmd"

echo "Created: $TARGET_DIR"
echo "Main file: $TARGET_DIR/$DIR_NAME.qmd"
echo ""
echo "Next steps:"
echo "  cd $TARGET_DIR"
echo "  quarto preview $DIR_NAME.qmd   # live preview"
echo "  ./build.sh                     # render HTML + PDF"
