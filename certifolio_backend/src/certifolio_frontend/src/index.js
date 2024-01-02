import { icp_login_backend } from "../../declarations/certifolio_backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import {AuthClient} from "@dfinity/auth-client";

import { idlFactory } from "../../declarations/certifolio_backend/certifolio_backend.did.js";

let globalIdentity;
let actor;



window.onload = async () => {
  const authClient = await AuthClient.create();
  console.log("authClient", await authClient.isAuthenticated());
  if(await authClient.isAuthenticated()){
    
    globalIdentity = await authClient.getIdentity();
    console.log("identity", globalIdentity.getPrincipal().toString());
    const agent = new HttpAgent({ "identity":globalIdentity });
    if (process.env.DFX_NETWORK !== "ic") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }
    actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.CANISTER_ID_CERTIFOLIO_BACKEND,
    });
    const principal = await actor.whoami();
    console.log("kontol", principal.toString());
  }  
  console.log("globalIdentity", globalIdentity);
}

document.querySelector("#mintForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const formData = {
    _uri: document.getElementById('uri').value,
    _name: document.getElementById('name').value,
    _certificateId: document.getElementById('certificateId').value,
    _eventName: document.getElementById('eventName').value,
    _standing: document.getElementById('standing').value,
    _track: document.getElementById('track').value,
    _scope: document.getElementById('scope').value,
  };

  button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  //const greeting = await actor.mint(formData);
  const greet2 = await actor.mint(
    formData._uri,
    formData._name,
    parseInt(formData._certificateId),
    formData._eventName,
    parseInt(formData._standing),
    formData._track,
    formData._scope
  );

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greet2;

  return false;
});

document.querySelector("#addPub").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");


  button.setAttribute("disabled", true);
  const formData = {
    _name: document.getElementById('name').value,
  };
  // Interact with foo actor, calling the greet method
  //const greeting = await actor.mint(formData);
  const greet2 = await actor.addPublisher(
    formData._name,
  );

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greet2;

  return false;
});

//for logout
document.querySelector("#logout").addEventListener("click", async (e) => {
  e.preventDefault();
  const authClient = await AuthClient.create();
  await authClient.logout();
  console.log("logout");
});

//...


//login button
document.querySelector("#login").addEventListener("click", async (e) => {
  e.preventDefault();
  const authClient = await AuthClient.create();

  await authClient.login({
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000000000),
    onSuccess: async () => {
      await handleAuthenticated(authClient);
    },
    identityProvider: process.env.DFX_NETWORK === "ic" ? "https://identity.ic0.app/#authorize" : "http://localhost:4943/?canisterId=" + process.env.INTERNET_IDENTITY_CANISTER_ID,
  });

  async function  handleAuthenticated(authClient){
    console.log("Authenticated with identity: ", authClient.getIdentity().getPrincipal().toString());
    const identity = authClient.getIdentity();
    globalIdentity = identity;
    console.log("identity", globalIdentity.getPrincipal().toString());
    const agent = new HttpAgent({ identity });
    if (process.env.DFX_NETWORK !== "ic") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }
    actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.CANISTER_ID_CERTIFOLIO_BACKEND,
    });
    console.log("ppppppp");
    const principal = await actor.whoami();
    console.log("principal", principal.toString());
    };

}); 

//whoami button
document.querySelector("#whoami").addEventListener("click", async (e) => {
  e.preventDefault();
  const principal = await actor.whoami();
  console.log("kontol", principal.toString());
});