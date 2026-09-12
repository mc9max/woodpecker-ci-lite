#!/bin/sh
set -e

# Ensure the volume directory exists and is writable
mkdir -p /var/lib/woodpecker
chmod 777 /var/lib/woodpecker

# Run as root (Railway volumes are root-owned)
exec /bin/woodpecker-server
