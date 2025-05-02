#!/bin/bash
# Build script for Next.js application

echo "Starting build process for Next.js application..."

# Install dependencies
npm ci

# Build the application
npm run build

echo "Build completed successfully!"
