/** @type {import('next').NextConfig} */
require('dotenv').config();
const nextConfig = {
    env: {
        DFX_VERSION: process.env.DFX_VERSION,
  DFX_NETWORK: process.env.DFX_NETWORK,
  CANISTER_CANDID_PATH_certifolio_backend: process.env.CANISTER_CANDID_PATH_certifolio_backend,
  CANISTER_CANDID_PATH_CERTIFOLIO_BACKEND: process.env.CANISTER_CANDID_PATH_CERTIFOLIO_BACKEND || 'NOTHING',
  INTERNET_IDENTITY_CANISTER_ID: process.env.INTERNET_IDENTITY_CANISTER_ID,
  CANISTER_ID_INTERNET_IDENTITY: process.env.CANISTER_ID_INTERNET_IDENTITY,
  CANISTER_ID_internet_identity: process.env.CANISTER_ID_internet_identity,
  CERTIFOLIO_FRONTEND_CANISTER_ID: process.env.CERTIFOLIO_FRONTEND_CANISTER_ID,
  CANISTER_ID_CERTIFOLIO_FRONTEND: process.env.CANISTER_ID_CERTIFOLIO_FRONTEND,
  CANISTER_ID_certifolio_frontend: process.env.CANISTER_ID_certifolio_frontend,
  CERTIFOLIO_BACKEND_CANISTER_ID: process.env.CERTIFOLIO_BACKEND_CANISTER_ID,
  CANISTER_ID_CERTIFOLIO_BACKEND: process.env.CANISTER_ID_CERTIFOLIO_BACKEND,
  CANISTER_ID_certifolio_backend: process.env.CANISTER_ID_certifolio_backend,
  CANISTER_ID: process.env.CANISTER_ID,
  CANISTER_CANDID_PATH: process.env.CANISTER_CANDID_PATH
    }
}

module.exports = nextConfig
