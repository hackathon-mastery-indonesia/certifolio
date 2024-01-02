import { AuthClient } from "@dfinity/auth-client";
import { AUTH_BASE_URL } from "../base/base_url";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../app/smartContractUtil/certifolio_backend.did.js";
import User from "../next_models/user";
import { json } from "stream/consumers";
import { todo } from "node:test";

/*
ON PROGRESS
*/

const handleAuthenticated = async  (authClient: AuthClient, username: string)=> {
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity: identity, host: AUTH_BASE_URL });
    if (process.env.DFX_NETWORK !== "ic") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }
    
    const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_CERTIFOLIO_BACKEND,
      });
    // const principal = await actor.whoami();
    console.log('here');
    const user: User = {
        identity: JSON.stringify(identity),
        contract: JSON.stringify(actor),
        authClient: JSON.stringify(authClient),
        isVerified: false , //todo
        username: username //todo
    }
    return user;
}

const isAuthenticated= async  (authClient: AuthClient) :Promise<boolean> => {
    return authClient.isAuthenticated()
}

const logoutUser = async (authClient: AuthClient, onSuccess: () => void) => {
    try {
      await authClient.logout();
      onSuccess(); // Panggil callback onSuccess setelah logout berhasil
    } catch (error) {
      console.error('Logout failed:', error);
      // Tangani kesalahan jika logout gagal
      // Anda juga dapat menambahkan callback onFailure di sini untuk menangani kasus logout yang gagal
    }
  };

  const loginUser = async (onSuccess: (newUser: User) => void, username:string): Promise<string> => {
    try {
      console.log(process.env.INTERNET_IDENTITY_CANISTER_ID);
      const URL = `${AUTH_BASE_URL}/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`;
      const authClient = await AuthClient.create();
  
      // Menggunakan Promise untuk menunggu callback onSuccess selesai
      const successPromise = new Promise<string>((resolve, reject) => {
        authClient?.login({
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000000000),
          onSuccess: async () => {
            try {
              const user = await handleAuthenticated(authClient, username);
              onSuccess(user);
              resolve("SUCCESS"); // Resolve Promise ketika selesai
            } catch (error) {
              reject("FAILED"); // Reject Promise jika terjadi error
            }
          },
          identityProvider: URL,
        });
      });
  
      // Menunggu hingga Promise selesai sebelum mengembalikan nilai
      return await successPromise;
    } catch (error) {
      return "FAILED";
    }
  };
  
  

export {
    loginUser,
    isAuthenticated,
    logoutUser 
}

