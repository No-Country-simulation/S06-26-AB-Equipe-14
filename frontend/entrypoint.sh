#!/bin/sh
set -e
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
    echo "Installing dependencies..."
    find node_modules -mindepth 1 -delete 2>/dev/null || true
    npm install
fi
exec "$@"