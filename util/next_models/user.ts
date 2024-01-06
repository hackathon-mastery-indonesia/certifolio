// Di dalam berkas userInterfaces.ts
// DONE
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

export default interface User {
    authClient: any | null;
    identity: any | null;
    actor: any | null;
    contract: string | null;
    username: string | null;
    isVerified: boolean;
    
  }
  