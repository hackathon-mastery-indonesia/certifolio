// Di dalam berkas userInterfaces.ts
// DONE
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

export default interface User {
    authClient: string | null;
    identity: string | null;
    contract: string | null;
  }
  