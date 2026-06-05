import { ethers } from "ethers";

// Ethereum Sepolia Testnet Chain ID
const SEPOLIA_CHAIN_ID = "0xaa36a7";

/**
 * Connect MetaMask wallet and return signer
 * Used for smart contract interactions
 */
export const connectWallet = async () => {
  try {
    //////////////////////////////////////////////////////
    // CHECK METAMASK
    //////////////////////////////////////////////////////

    if (!window.ethereum) {
      alert("MetaMask not installed");
      throw new Error("MetaMask not installed");
    }

    //////////////////////////////////////////////////////
    // CREATE PROVIDER
    //////////////////////////////////////////////////////

    const provider = new ethers.BrowserProvider(window.ethereum);

    //////////////////////////////////////////////////////
    // CONNECT WALLET
    //////////////////////////////////////////////////////

    let accounts = await provider.listAccounts();

    if (accounts.length === 0) {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    }

    //////////////////////////////////////////////////////
    // CHECK NETWORK
    //////////////////////////////////////////////////////

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log("Connected Chain ID:", chainId);

    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError) {
        alert("Please switch to Sepolia network manually");
        throw new Error("Wrong network");
      }
    }

    //////////////////////////////////////////////////////
    // RETURN SIGNER
    //////////////////////////////////////////////////////

    const signer = await provider.getSigner();

    return signer;
  } catch (error) {
    console.error("Wallet Error:", error);
    throw error;
  }
};