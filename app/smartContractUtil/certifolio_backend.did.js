export const idlFactory = ({ IDL }) => {
  const TokenId = IDL.Nat;
  const Metadata = IDL.Record({
    'id' : IDL.Nat,
    'uri' : IDL.Text,
    'publisher' : IDL.Principal,
    'name' : IDL.Text,
    'certificateId' : IDL.Text,
  });
  return IDL.Service({
    'addPublisher' : IDL.Func([IDL.Text], [], ['oneway']),
    'addToBundle' : IDL.Func([IDL.Nat, TokenId], [], ['query']),
    'approve' : IDL.Func([IDL.Principal, TokenId], [], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
    'createBundle' : IDL.Func([IDL.Vec(IDL.Nat), IDL.Text], [IDL.Nat], []),
    'doIOwn' : IDL.Func([IDL.Nat], [IDL.Bool], ['query']),
    'getApproved' : IDL.Func([IDL.Nat], [IDL.Principal], []),
    'getBatchMetadata' : IDL.Func(
        [IDL.Vec(TokenId)],
        [IDL.Vec(Metadata)],
        ['query'],
      ),
    'getBundle' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Vec(IDL.Nat))], ['query']),
    'getBundleMetadata' : IDL.Func([IDL.Nat], [IDL.Vec(Metadata)], ['query']),
    'getBundleName' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Text)], ['query']),
    'getBundleOwned' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(IDL.Nat))],
        ['query'],
      ),
    'getBundleOwner' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Principal)], ['query']),
    'getCertificateId' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'getCertificateOwned' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(TokenId))],
        ['query'],
      ),
    'getDate' : IDL.Func([TokenId], [IDL.Opt(IDL.Int)], ['query']),
    'getEventName' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'getMetadata' : IDL.Func([TokenId], [Metadata], ['query']),
    'getName' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'getOwnedMetadata' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Metadata)],
        ['query'],
      ),
    'getPublisher' : IDL.Func([TokenId], [IDL.Opt(IDL.Principal)], ['query']),
    'getPublisherName' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getScope' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'getStanding' : IDL.Func([TokenId], [IDL.Opt(IDL.Nat)], ['query']),
    'getTrack' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        [],
      ),
    'mint' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'ownerOf' : IDL.Func([TokenId], [IDL.Opt(IDL.Principal)], ['query']),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [], ['oneway']),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'tokenURI' : IDL.Func([TokenId], [IDL.Opt(IDL.Text)], ['query']),
    'totalBundle' : IDL.Func([], [IDL.Nat], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [],
        ['oneway'],
      ),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
