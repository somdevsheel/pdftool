#!/usr/bin/env bash
# Cleanup expired files from storage directories
# Usage: ./cleanup.sh [expiry_minutes]

EXPIRY_MINUTES=${1:-60}
STORAGE_DIR="$(dirname "$0")/../storage"

echo "Cleaning files older than ${EXPIRY_MINUTES} minutes..."

deleted=0
for dir in uploads processing output; do
  full_path="$STORAGE_DIR/$dir"
  if [ -d "$full_path" ]; then
    count=$(find "$full_path" -type f -mmin "+${EXPIRY_MINUTES}" | wc -l)
    find "$full_path" -type f -mmin "+${EXPIRY_MINUTES}" -delete
    deleted=$((deleted + count))
    echo "  $dir: removed $count files"
  fi
done

echo "Done. Total removed: $deleted files"
