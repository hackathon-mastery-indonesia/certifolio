import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import P "mo:base/Prelude";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor certifolio {
	
	public shared query (doIOwn__msg) func doIOwn(tokenId : Nat) : async Bool {
		let caller = doIOwn__msg.caller; // First input
		_ownerOf(tokenId) == ?caller;
	};
	//placeholder
	stable var admin : Principal = Principal.fromText("un4fu-tqaaa-aaaab-qadjq-cai");
	
	stable var name_ : Text = "CertiFolio";
	
	stable var symbol_ : Text = "CRTF";
	
	// Adapted from: https://github.com/SuddenlyHazel/DIP721/blob/main/src/DIP721/DIP721.mo
	
	private type TokenAddress = Principal;
	private type TokenId = Nat;
	public type Metadata = {
		uri : Text;
		name : Text;
		publisher : Principal;
		certificateId : Text;
	};
	
	private stable var tokenPk : Nat = 0;
	private stable var bundlePk : Nat = 0;
	
	private stable var tokenURIEntries : [(TokenId, Text)] = [];
	private stable var ownersEntries : [(TokenId, Principal)] = [];
	private stable var balancesEntries : [(Principal, Nat)] = [];
	private stable var tokenApprovalsEntries : [(TokenId, Principal)] = [];
	private stable var operatorApprovalsEntries : [(Principal, [Principal])] = [];
	private stable var publisherName : [(Principal, Text)] = [];
	//paramnya apa aja?
// -nama peserta
// -gambar
// -publisher
// -id sertif
// -nama sertif/nama event
// -juara ..... ?
	private stable var nameEntries : [(TokenId, Text)] = [];
	//image is tokenURI
	private stable var publisherEntries : [(TokenId, Principal)] = [];
	private stable var certificateIdEntries : [(TokenId, Text)] = [];
	private stable var eventNameEntries : [(TokenId, Text)] = [];
	private stable var standingEntries : [(TokenId, Nat)] = [];
	private stable var trackEntries : [(TokenId, Text)] = [];
	private stable var dateEntries : [(TokenId, Int)] = [];
	private stable var scopeEntries : [(TokenId, Text)] = [];
	//bundling part
	private stable var bundleEntries : [(Nat, [TokenId])] = [];
	private stable var bundleOwnerEntries : [(Nat, Principal)] = [];
	private stable var bundleNameEntries : [(Nat, Text)] = [];
	//helper
	private stable var certficateOwnedList : [(Principal, [TokenId])] = [];
	private stable var bundleOwnedList : [(Principal, [Nat])] = [];


	
	private let tokenURIs : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(tokenURIEntries.vals(), 10, Nat.equal, Hash.hash);
	private let owners : HashMap.HashMap<TokenId, Principal> = HashMap.fromIter<TokenId, Principal>(ownersEntries.vals(), 10, Nat.equal, Hash.hash);
	private let balances : HashMap.HashMap<Principal, Nat> = HashMap.fromIter<Principal, Nat>(balancesEntries.vals(), 10, Principal.equal, Principal.hash);
	private let tokenApprovals : HashMap.HashMap<TokenId, Principal> = HashMap.fromIter<TokenId, Principal>(tokenApprovalsEntries.vals(), 10, Nat.equal, Hash.hash);
	private let operatorApprovals : HashMap.HashMap<Principal, [Principal]> = HashMap.fromIter<Principal, [Principal]>(operatorApprovalsEntries.vals(), 10, Principal.equal, Principal.hash);
	private let publishersName : HashMap.HashMap<Principal, Text> = HashMap.fromIter<Principal, Text>(publisherName.vals(), 10, Principal.equal, Principal.hash);
	private let names : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(nameEntries.vals(), 10, Nat.equal, Hash.hash);
	private let publishers : HashMap.HashMap<TokenId, Principal> = HashMap.fromIter<TokenId, Principal>(publisherEntries.vals(), 10, Nat.equal, Hash.hash);
	private let certificateId : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(certificateIdEntries.vals(), 10, Nat.equal, Hash.hash);
	private let eventName : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(eventNameEntries.vals(), 10, Nat.equal, Hash.hash);
	private let standing : HashMap.HashMap<TokenId, Nat> = HashMap.fromIter<TokenId, Nat>(standingEntries.vals(), 10, Nat.equal, Hash.hash);
	private let track : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(trackEntries.vals(), 10, Nat.equal, Hash.hash);
	private let date : HashMap.HashMap<TokenId, Int> = HashMap.fromIter<TokenId, Int>(dateEntries.vals(), 10, Nat.equal, Hash.hash);
	private let scope : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(scopeEntries.vals(), 10, Nat.equal, Hash.hash);


	private let bundle : HashMap.HashMap<Nat, [TokenId]> = HashMap.fromIter<Nat, [TokenId]>(bundleEntries.vals(), 10, Nat.equal, Hash.hash);
	private let bundleOwner : HashMap.HashMap<Nat, Principal> = HashMap.fromIter<Nat, Principal>(bundleOwnerEntries.vals(), 10, Nat.equal, Hash.hash);
	private let bundleName : HashMap.HashMap<Nat, Text> = HashMap.fromIter<Nat, Text>(bundleNameEntries.vals(), 10, Nat.equal, Hash.hash);
	private let certificateOwned : HashMap.HashMap<Principal, [TokenId]> = HashMap.fromIter<Principal, [TokenId]>(certficateOwnedList.vals(), 10, Principal.equal, Principal.hash);
	private let bundleOwned : HashMap.HashMap<Principal, [Nat]> = HashMap.fromIter<Principal, [Nat]>(bundleOwnedList.vals(), 10, Principal.equal, Principal.hash); 
	

	private func _unwrap<T>(x : ?T) : T {
		switch x {
			case null { P.unreachable() };
			case (?x_) { x_ };
		}
	};
	
	public shared query func totalSupply() : async Nat {
		return tokenPk;
	};

	public shared query func totalBundle() : async Nat {
		return bundlePk;
	};

	public shared query func getCertificateOwned(p : Principal) : async ?[TokenId] {
		return certificateOwned.get(p);
	};

	public shared query func getBundleOwned(p : Principal) : async ?[Nat] {
		return bundleOwned.get(p);
	};

	public shared query func getMetadata(ids : TokenId) : async Metadata {
		let metadata : Metadata = {
			uri = _unwrap(tokenURIs.get(ids));
			name = _unwrap(names.get(ids));
			publisher = _unwrap(publishers.get(ids));
			certificateId = _unwrap(certificateId.get(ids));
		};
		return metadata;
	};

	public shared query func getBatchMetadata(ids : [TokenId]) : async [Metadata] {
		var metadata : [Metadata] = [];
		for (id in ids.vals()) {
			let temp : Metadata = {
				uri = _unwrap(tokenURIs.get(id));
				name = _unwrap(names.get(id));
				publisher = _unwrap(publishers.get(id));
				certificateId = _unwrap(certificateId.get(id));
			};
			metadata := Array.append<Metadata>(metadata, [temp]);
		};
		return metadata;
	};

	public shared query func getBundleMetadata(id : Nat) : async [Metadata] {
		var metadata : [Metadata] = [];
		switch (bundle.get(id)) {
			case (?bundle) {
				for (id in bundle.vals()) {
					let temp : Metadata = {
						uri = _unwrap(tokenURIs.get(id));
						name = _unwrap(names.get(id));
						publisher = _unwrap(publishers.get(id));
						certificateId = _unwrap(certificateId.get(id));
					};
					metadata := Array.append<Metadata>(metadata, [temp]);
				};
			};
			case null {};
		};
		return metadata;
	};

	public shared query func getOwnedMetadata(p : Principal) : async [Metadata] {
		var metadata : [Metadata] = [];
		switch (certificateOwned.get(p)) {
			case (?owned) {
				for (id in owned.vals()) {
					let temp : Metadata = {
						uri = _unwrap(tokenURIs.get(id));
						name = _unwrap(names.get(id));
						publisher = _unwrap(publishers.get(id));
						certificateId = _unwrap(certificateId.get(id));
						
					};
					metadata := Array.append<Metadata>(metadata, [temp]);
				};
			};
			case null {};
		};
		return metadata;
	};

	public shared query func addToBundle(bundleId : Nat, tokenId : TokenId) : async () {
		let temp = bundle.get(bundleId);
		switch (temp) {
			case (?bundlee) {
				let array = Array.append<TokenId>(bundlee, [tokenId]);
				bundle.put(bundleId, array);
			};
			case null {
				bundle.put(bundleId, [tokenId]);
			};
		};
	};
	
	public shared query func balanceOf(p : Principal) : async ?Nat {
		return balances.get(p);
	};
	
	public shared query func ownerOf(tokenId : TokenId) : async ?Principal {
		return _ownerOf(tokenId);
	};

	public shared query (msg) func whoami() : async Text {
		return Principal.toText(msg.caller);
  	};
	
	public shared query func tokenURI(tokenId : TokenId) : async ?Text {
		return _tokenURI(tokenId);
	};

	public shared query func getPublisherName(publisher : Principal) : async ?Text {
		return publishersName.get(publisher);
	};

	public shared query func getName(tokenId : TokenId) : async ?Text {
		return names.get(tokenId);
	};

	public shared query func getPublisher(tokenId : TokenId) : async ?Principal {
		return publishers.get(tokenId);
	};

	public shared query func getCertificateId(tokenId : TokenId) : async ?Text {
		return certificateId.get(tokenId);
	};

	public shared query func getEventName(tokenId : TokenId) : async ?Text {
		return eventName.get(tokenId);
	};

	public shared query func getStanding(tokenId : TokenId) : async ?Nat {
		return standing.get(tokenId);
	};

	public shared query func getTrack(tokenId : TokenId) : async ?Text {
		return track.get(tokenId);
	};

	public shared query func getDate(tokenId : TokenId) : async ?Int {
		return date.get(tokenId);
	};

	public shared query func getScope(tokenId : TokenId) : async ?Text {
		return scope.get(tokenId);
	};


	//bundling logic
	public shared(msg) func createBundle(tokenIds : [Nat], name : Text) : async Nat {
		bundlePk += 1;
		bundle.put(bundlePk, tokenIds);
		bundleOwner.put(bundlePk, msg.caller);
		bundleName.put(bundlePk, name);
		//add to bundleOwned
		let temp = bundleOwned.get(msg.caller);
		switch (temp) {
			case (?owned) {
				let array = Array.append<Nat>(owned, [bundlePk]);
				bundleOwned.put(msg.caller, array);
			};
			case null {
				bundleOwned.put(msg.caller, [bundlePk]);
			};
		};
		return bundlePk;
	};

	public shared query func getBundleOwner(bundleId : Nat) : async ?Principal {
		return bundleOwner.get(bundleId);
	};

	public shared query func getBundle(bundleId : Nat) : async ?[Nat] {
		return bundle.get(bundleId);
	};

	public shared query func getBundleName(bundleId : Nat) : async ?Text {
		return bundleName.get(bundleId);
	};
	
	public shared query func name() : async Text {
		return name_;
	};
	
	public shared query func symbol() : async Text {
		return symbol_;
	};
	
	public shared func isApprovedForAll(owner : Principal, opperator : Principal) : async Bool {
		return _isApprovedForAll(owner, opperator);
	};
	
	public shared(msg) func approve(to : Principal, tokenId : TokenId) : async () {
		switch(_ownerOf(tokenId)) {
			case (?owner) {
				assert to != owner;
				assert msg.caller == owner or _isApprovedForAll(owner, msg.caller);
				_approve(to, tokenId);
			};
			case (null) {
				throw Error.reject("No owner for token")
			};
		}
	};
	
	public shared func getApproved(tokenId : Nat) : async Principal {
		switch(_getApproved(tokenId)) {
			case (?v) { return v };
			case null { throw Error.reject("None approved") }
		}
	};
	
	public shared(msg) func setApprovalForAll(op : Principal, isApproved : Bool) : () {
		assert msg.caller != op;
		
		switch (isApproved) {
			case true {
				switch (operatorApprovals.get(msg.caller)) {
					case (?opList) {
						var array = Array.filter<Principal>(opList,func (p) { p != op });
						array := Array.append<Principal>(array, [op]);
						operatorApprovals.put(msg.caller, array);
					};
					case null {
						operatorApprovals.put(msg.caller, [op]);
					};
				};
			};
			case false {
				switch (operatorApprovals.get(msg.caller)) {
					case (?opList) {
						let array = Array.filter<Principal>(opList, func(p) { p != op });
						operatorApprovals.put(msg.caller, array);
					};
					case null {
						operatorApprovals.put(msg.caller, []);
					};
				};
			};
		};
		
	};
	
	public shared(msg) func transferFrom(from : Principal, to : Principal, tokenId : Nat) : () {
		assert _isApprovedOrOwner(msg.caller, tokenId);
		
		_transfer(from, to, tokenId);
	};
	
	public shared(msg) func mint(
			_uri : Text,
			_name : Text,
			_certificateId : Text,
		) : async Nat {
		let _date = Time.now();
		let _publisher = msg.caller;

		//assert publishersName.get(_publisher) != null;

		tokenPk += 1;
		
		_mint(msg.caller, tokenPk, _uri);
		names.put(tokenPk, _name);
		publishers.put(tokenPk, _publisher);
		certificateId.put(tokenPk, _certificateId);
		//add to certificateOwned
		let temp = certificateOwned.get(msg.caller);
		switch (temp) {
			case (?owned) {
				let array = Array.append<TokenId>(owned, [tokenPk]);
				certificateOwned.put(msg.caller, array);
			};
			case null {
				certificateOwned.put(msg.caller, [tokenPk]);
			};
		};
		
		return tokenPk;
	};

	//temp 
	public shared(msg) func addPublisher(_name : Text) : () {
		//assert msg.caller == admin;
		//publishersName.put(pub, _name);
		publishersName.put(msg.caller, _name);
	};


	
	// Internal
	
	private func _ownerOf(tokenId : TokenId) : ?Principal {
		return owners.get(tokenId);
	};
	
	private func _tokenURI(tokenId : TokenId) : ?Text {
		return tokenURIs.get(tokenId);
	};
	
	private func _isApprovedForAll(owner : Principal, opperator : Principal) : Bool {
		switch (operatorApprovals.get(owner)) {
			case(?whiteList) {
				for (allow in whiteList.vals()) {
					if (allow == opperator) {
						return true;
					};
				};
			};
			case null {return false;};
		};
		return false;
	};
	
	private func _approve(to : Principal, tokenId : Nat) : () {
		tokenApprovals.put(tokenId, to);
	};
	
	private func _removeApprove(tokenId : Nat) : () {
		ignore tokenApprovals.remove(tokenId);
	};
	
	private func _exists(tokenId : Nat) : Bool {
		return Option.isSome(owners.get(tokenId));
	};
	
	private func _getApproved(tokenId : Nat) : ?Principal {
		assert _exists(tokenId) == true;
		switch(tokenApprovals.get(tokenId)) {
			case (?v) { return ?v };
			case null {
				return null;
			};
		}
	};
	
	private func _hasApprovedAndSame(tokenId : Nat, spender : Principal) : Bool {
		switch(_getApproved(tokenId)) {
			case (?v) {
				return v == spender;
			};
			case null { return false }
		}
	};
	
	private func _isApprovedOrOwner(spender : Principal, tokenId : Nat) : Bool {
		assert _exists(tokenId);
		let owner = _unwrap(_ownerOf(tokenId));
		return spender == owner or _hasApprovedAndSame(tokenId, spender) or _isApprovedForAll(owner, spender);
	};
	
	private func _transfer(from : Principal, to : Principal, tokenId : Nat) : () {
		assert _exists(tokenId);
		assert _unwrap(_ownerOf(tokenId)) == from;
		
		// Bug in HashMap https://github.com/dfinity/motoko-base/pull/253/files
		// this will throw unless you patch your file
		_removeApprove(tokenId);
		
		_decrementBalance(from);
		_incrementBalance(to);
		owners.put(tokenId, to);
	};
	
	private func _incrementBalance(address : Principal) {
		switch (balances.get(address)) {
			case (?v) {
				balances.put(address, v + 1);
			};
			case null {
				balances.put(address, 1);
			}
		}
	};
	
	private func _decrementBalance(address : Principal) {
		switch (balances.get(address)) {
			case (?v) {
				balances.put(address, v - 1);
			};
			case null {
				balances.put(address, 0);
			}
		}
	};
	
	private func _mint(to : Principal, tokenId : Nat, uri : Text) : () {
		assert not _exists(tokenId);
		
		_incrementBalance(to);
		owners.put(tokenId, to);
		tokenURIs.put(tokenId,uri)
	};
	
	private func _burn(tokenId : Nat) {
		let owner = _unwrap(_ownerOf(tokenId));
		
		_removeApprove(tokenId);
		_decrementBalance(owner);
		
		ignore owners.remove(tokenId);
	};
	
	system func preupgrade() {
		tokenURIEntries := Iter.toArray(tokenURIs.entries());
		ownersEntries := Iter.toArray(owners.entries());
		balancesEntries := Iter.toArray(balances.entries());
		tokenApprovalsEntries := Iter.toArray(tokenApprovals.entries());
		operatorApprovalsEntries := Iter.toArray(operatorApprovals.entries());
		publisherName := Iter.toArray(publishersName.entries());
		nameEntries := Iter.toArray(names.entries());
		publisherEntries := Iter.toArray(publishers.entries());
		certificateIdEntries := Iter.toArray(certificateId.entries());
		eventNameEntries := Iter.toArray(eventName.entries());
		standingEntries := Iter.toArray(standing.entries());
		trackEntries := Iter.toArray(track.entries());
		dateEntries := Iter.toArray(date.entries());
		scopeEntries := Iter.toArray(scope.entries());
		bundleEntries := Iter.toArray(bundle.entries());
		bundleOwnerEntries := Iter.toArray(bundleOwner.entries());
		bundleNameEntries := Iter.toArray(bundleName.entries());
		bundleOwnedList := Iter.toArray(bundleOwned.entries());
		certficateOwnedList := Iter.toArray(certificateOwned.entries());

	};
	
	system func postupgrade() {
		tokenURIEntries := [];
		ownersEntries := [];
		balancesEntries := [];
		tokenApprovalsEntries := [];
		operatorApprovalsEntries := [];
		publisherName := [];
		nameEntries := [];
		publisherEntries := [];
		certificateIdEntries := [];
		eventNameEntries := [];
		standingEntries := [];
		trackEntries := [];
		dateEntries := [];
		scopeEntries := [];
		bundleEntries := [];
		bundleOwnerEntries := [];
		bundleNameEntries := [];
		bundleOwnedList := [];
		certficateOwnedList := [];
	};
}