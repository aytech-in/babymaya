#!/bin/sh
# Run before every commit: gives phones a fresh copy instead of a cached one.
cd "$(dirname "$0")" || exit 1
V=$(date +%s)
perl -pi -e "s/\?v=\d+/?v=$V/g" index.html data.js
echo "cache version: $V"
