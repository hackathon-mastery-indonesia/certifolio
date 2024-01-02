#!/bin/bash

# Install dependensi frontend
npm install

# Start dfx in background mode
dfx start --background

# Change directory to backend
cd certifolio_backend

# Install dependensi backend
npm install

# Deploy with dfx
dfx deploy

# Copy and override env from current path to parent
cp -f .env ../.env

# Back to main directory
cd ..

# Run npm run dev
npm run dev

