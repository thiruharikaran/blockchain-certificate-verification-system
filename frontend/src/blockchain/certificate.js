import { ethers } from "ethers";
import { connectWallet } from "./connectWallet.js";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract.js";

// Store certificate hash on blockchain
export const addCertificate = async (hash) => {
  try {
    if (!hash) {
      throw new Error(
        "Certificate hash is required"
      );
    }

    // Connect wallet and obtain signer
    const signer =
      await connectWallet();

    // Create contract instance
    const contract =
      new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

    // Submit certificate hash to blockchain
    const transaction =
      await contract.addCertificate(
        hash
      );

    // Wait for transaction confirmation
    await transaction.wait();

    return transaction;
  } catch (error) {
    console.error(
      "Add Certificate Error:",
      error
    );

    throw error;
  }
};

// Verify certificate hash from blockchain
export const verifyCertificate = async (
  hash
) => {
  try {
    if (!hash) {
      throw new Error(
        "Certificate hash is required"
      );
    }

    // Connect wallet and obtain signer
    const signer =
      await connectWallet();

    // Create contract instance
    const contract =
      new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

    // Check certificate existence
    return await contract.verifyCertificate(
      hash
    );
  } catch (error) {
    console.error(
      "Verify Certificate Error:",
      error
    );

    throw error;
  }
};