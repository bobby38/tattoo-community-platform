#!/bin/sh
set -e

# Print environment for debugging (excluding sensitive data)
echo "Starting Ink2Tattoo application..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"

# Create required directories if they don't exist
mkdir -p ./public/uploads/gallery
chmod -R 777 ./public/uploads

# Check if the database is configured
if [ -n "$DATABASE_URL" ]; then
  echo "Database connection configured"
else
  echo "WARNING: No database connection configured, using fallback data"
fi

# Execute the CMD from the Dockerfile (passed as arguments to this script)
exec "$@"
