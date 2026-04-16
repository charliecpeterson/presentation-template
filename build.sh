#!/usr/bin/env bash
# build.sh — render Quarto slides to HTML + PDF
#
# Usage:
#   ./build.sh              # auto-detects the first *.qmd in current directory
#   ./build.sh talk.qmd     # explicit file

set -euo pipefail

# ── Resolve source file ────────────────────────────────────────────────────────
if [[ $# -ge 1 ]]; then
  QMD="$1"
else
  QMD=$(ls *.qmd 2>/dev/null | head -1)
  if [[ -z "$QMD" ]]; then
    echo "ERROR: no .qmd file found in $(pwd)" >&2
    exit 1
  fi
fi

if [[ ! -f "$QMD" ]]; then
  echo "ERROR: file not found: $QMD" >&2
  exit 1
fi

BASENAME="${QMD%.qmd}"
OUTPUT_DIR="_output"
HTML_FILE="${OUTPUT_DIR}/${BASENAME}.html"
PDF_FILE="${OUTPUT_DIR}/${BASENAME}.pdf"

# ── Render HTML ────────────────────────────────────────────────────────────────
echo "▸ Rendering $QMD → $HTML_FILE"
quarto render "$QMD"

# ── Convert to PDF via decktape ────────────────────────────────────────────────
echo "▸ Converting to PDF → $PDF_FILE"

# decktape requires:
#   --screenshots-directory  = absolute path
#   pdf output filename      = relative (not absolute) — decktape joins them internally
npx decktape reveal \
  --size 1280x720 \
  "$(pwd)/${HTML_FILE}" \
  "${BASENAME}.pdf"

# decktape writes the PDF relative to cwd; move it into _output/
mv "${BASENAME}.pdf" "${PDF_FILE}"

echo "✓ Done"
echo "  HTML: ${HTML_FILE}"
echo "  PDF:  ${PDF_FILE}"
