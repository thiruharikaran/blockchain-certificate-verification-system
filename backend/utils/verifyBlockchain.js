const { ethers } = require("ethers");
const path = require("path");

// ✅ USE REAL ADDRESS FROM .env
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// ✅ load ABI
const contractPath = path.join(
  __dirname,
  "../../blockchain/artifacts/contracts/CertificateVerification.sol/CertificateVerification.json"
);

const contractJSON = require(contractPath);

// ✅ connect to local blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

async function verifyBlockchain(hash) {
  try {
    if (!CONTRACT_ADDRESS) {
      console.error("❌ CONTRACT_ADDRESS missing in .env");
      return false;
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractJSON.abi,
      provider
    );

    const exists = await contract.verifyCertificate(hash);

    console.log("Blockchain verify result:", exists);

    return exists;

  } catch (err) {
    console.error("❌ Blockchain verify error:", err);
    return false;
  }
}

module.exports = verifyBlockchain;
