#!/bin/bash

# Check for required arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <source_directory> <output_file>"
  exit 1
fi

SRC_DIR="$1"
OUT_FILE="$2"

# Clear or create the output file
> "$OUT_FILE"

# Find all regular files recursively and process them
find "$SRC_DIR" -type f | while read -r FILE; do
  # Print a header with the relative file path
  echo "===== FILE: ${FILE#$SRC_DIR/} =====" >> "$OUT_FILE"
  # Append the file content
  cat "$FILE" >> "$OUT_FILE"
  # Add a newline after each file
  echo -e "\n" >> "$OUT_FILE"
done
