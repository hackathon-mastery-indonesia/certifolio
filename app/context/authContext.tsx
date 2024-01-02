import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory} from "../smartContractUtil/certifolio_backend.did.js";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type AuthContextType = {
    authClient: AuthClient | null;
    identity: any | null; // Consider defining a more specific type instead of 'any'
    contract: Actor | null; // Assuming that 'contract' can be null initially
    login: () => void;     // Add your login logic here
    logout: () => void;    // Add your logout logic here
};

const CERTIFOLIO_BACKEND = process.env.CANISTER_ID_CERTIFOLIO_BACKEND;
const INTERNET_IDENTITY= process.env.INTERNET_IDENTITY_CANISTER_ID;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};


export function AuthProvider({ children }: AuthProviderProps) {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [identity, setIdentity] = useState<any | null>(null); // Use a more specific type if possible
    const [contract, setContract] = useState<Actor | null>(null);

    async function handleAuthenticated(authClient : AuthClient){
        const identity = authClient.getIdentity();
    
        const agent = new HttpAgent({ identity: identity, host: "http://localhost:4943" });
        if (true) {
          agent.fetchRootKey().catch((err) => {
            console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
          });
        }
        const actor = Actor.createActor(idlFactory, {
          agent,
          canisterId: CERTIFOLIO_BACKEND,
        });

        setContract(actor);
        setIdentity(identity);
    };
    
    const isAuthenticated = async () => {
        return authClient?.isAuthenticated();
    }

    const login = async () => {
        console.log(6987);
        await authClient?.login({
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000000000),
            onSuccess: async () => {
              await handleAuthenticated(authClient);
            },
            identityProvider:  "http://localhost:4943/?canisterId=" + INTERNET_IDENTITY,
          });
    };

    const logout = async () => {
        // Implement logout logic
        // Example: setAuthClient(null), setIdentity(null), setContract(null)
        await authClient?.logout();
        setIdentity(null);
        setContract(null);
    };

    useEffect(() => {
        const initialize = async () => {
            // Your initialization logic here
            const authClientTemp = await AuthClient.create();
            await setAuthClient(authClientTemp);
            //console.log(authClientTemp);
            if(await authClientTemp.isAuthenticated()){
                handleAuthenticated(authClientTemp);
            }  
            //console.log(authClient);
        };
        //console.log("sude use effect");
        initialize();
    }, []); // Empty array ensures that effect is only run on mount

    const value: AuthContextType = { authClient, identity, contract, login, logout };
    console.log(value);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
