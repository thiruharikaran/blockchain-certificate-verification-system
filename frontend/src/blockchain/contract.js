export const CONTRACT_ADDRESS =
  "0x1BE2556C5FB1c9C2F51647913EFF267E2dEAF010";

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },

  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "addedBy",
        type: "address",
      },
    ],
    name: "CertificateAdded",
    type: "event",
  },

  {
    inputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "addCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "verifyCertificate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];