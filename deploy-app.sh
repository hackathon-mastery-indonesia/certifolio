echo "CBKADAL";

sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)";
#!/bin/bash
sudo apt-get update;
sudo apt-get install libunwind8;
sudo ldconfig;
locate libunwind.so.8;
echo "HEY TAYO";
# Install dependensi frontend
npm install;

echo "HEHEY INSTAL NPM";

# Start dfx in background mode
dfx start --background;

echo "RUN BACKGROUND";

# Change directory to backend
cd certifolio_backend;

# Install dependensi backend
npm install;

# Deploy with dfx
dfx deploy;

echo "SIP DEK";

# Copy and override env from current path to parent
cp -f .env ../.env;

# Back to main directory
cd ..;

# Run npm run dev
npm run dev;
